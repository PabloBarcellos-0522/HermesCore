// start-prod.js
const { spawn, execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const puppeteerCacheDir = path.join(__dirname, ".puppeteer_cache")

function runPm2() {
    console.log("[PROD START] Setting PUPPETEER_CACHE_DIR and starting application with PM2...")
    try {
        const env = { ...process.env, PUPPETEER_CACHE_DIR: puppeteerCacheDir }

        execSync("pm2 start scripts/pm2.config.js --env production", { stdio: "inherit", env: env })
        execSync("pm2 logs HermesCore", { stdio: "inherit", env: env })

        console.log("[PROD START] PM2 started. The bootstrap script will now exit.")
        process.exit(0)
    } catch (error) {
        console.error("[PROD START] Failed to start application with PM2.", error)
        process.exit(1)
    }
}

function runInstaller() {
    console.log(`[PROD START] Browser cache not found. Starting installation...`)

    // We set PUPPETEER_CACHE_DIR so the installer knows where to put the files.
    const env = { ...process.env, PUPPETEER_CACHE_DIR: puppeteerCacheDir }
    const installer = spawn("npx", ["@puppeteer/browsers", "install", "chrome"], {
        shell: true,
        env: env,
    })

    let killed = false

    const timeout = setTimeout(() => {
        if (!killed) {
            console.error("[PROD START] Installation timed out after 5 minutes.")
            installer.kill()
            process.exit(1)
        }
    }, 300000)

    installer.stdout.on("data", (data) => {
        const output = data.toString()
        console.log(output) // Log installer progress

        // The success indicator is the line like "chrome@146.0.7672.0 C:\...". We'll use "chrome@"
        if (!killed && output.includes("chrome@")) {
            killed = true
            console.log(
                "[PROD START] Browser installation appears complete. Killing hung installer process.",
            )
            clearTimeout(timeout)

            // Give it a brief moment to settle file writes before killing.
            setTimeout(() => {
                installer.kill()
                runPm2()
            }, 1000)
        }
    })

    installer.stderr.on("data", (data) => {
        console.error(`[INSTALLER STDERR] ${data}`)
    })

    installer.on("close", (code) => {
        // This will likely only be called on subsequent runs where it exits cleanly.
        if (!killed) {
            clearTimeout(timeout)
            if (code === 0) {
                console.log(
                    "[PROD START] Installer exited cleanly (browser was likely already installed).",
                )
                runPm2()
            } else {
                console.error(`[PROD START] Installer process failed with code ${code}.`)
                process.exit(1)
            }
        }
    })
}

// --- Main execution ---
// Check if the cache directory exists and is not empty.
if (fs.existsSync(puppeteerCacheDir) && fs.readdirSync(puppeteerCacheDir).length > 0) {
    console.log("[PROD START] Browser cache found. Starting application directly.")
    runPm2()
} else {
    runInstaller()
}
