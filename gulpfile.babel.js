import autoprefixer from "autoprefixer";
import browserSync from "browser-sync";
import cssnano from "cssnano";
import { dest, series, src, task, watch } from "gulp";
import postcss from "gulp-postcss";
import purgecss from "@fullhuman/postcss-purgecss";
import atimport from "postcss-import";
import nested from "postcss-nested";
import tailwindcss from "tailwindcss";

const SITE_ROOT = "./_site";
const POST_BUILD_STYLESHEET = `${SITE_ROOT}/assets/css/`;
const PRE_BUILD_STYLESHEET = "./src/css/style.css";
const TAILWIND_CONFIG = "./src/tailwind.js";

// Fix for Windows compatibility
const isWindowsPlatform = process.platform === "win32";
const jekyll = isWindowsPlatform ? "jekyll.bat" : "jekyll";
const spawn = isWindowsPlatform
  ? require("win-spawn")
  : require("child_process").spawn;

const isDevelopmentBuild = process.env.NODE_ENV === "development";

// Custom PurgeCSS Extractor for Tailwind CSS
const purgeForTailwind = content => content.match(/[\w-/:]+(?<!:)/g) || [];

task("buildJekyll", () => {
  browserSync.notify("Building Jekyll site...");

  const args = ["exec", jekyll, "build"];

  if (isDevelopmentBuild) {
    args.push("--incremental");
  }

  return spawn("bundle", args, { stdio: "inherit" });
});
              // purgecss({
              //   content: [`${SITE_ROOT}/**/*.html`],
              //   defaultExtractor: content =>
              //     content.match(/[\w-/:]+(?<!:)/g) || []
              // }),

task("processStyles", () => {
  browserSync.notify("Compiling styles...");

  return src(PRE_BUILD_STYLESHEET)
    .pipe(
      postcss([
        atimport(),
        tailwindcss(TAILWIND_CONFIG),
        autoprefixer(),
        nested(),
        ...(!isDevelopmentBuild
          ? [
              cssnano()
            ]
          : [])
      ])
    )
    .pipe(dest(POST_BUILD_STYLESHEET));
});

task("startServer", () => {
  browserSync.init({
    files: [SITE_ROOT + "/**"],
    open: "local",
    port: 4000,
    server: {
      baseDir: SITE_ROOT,
      serveStaticOptions: {
        extensions: ["html"]
      }
    }
  });

  watch(
    [
      "**/*.css",
      "**/*.html",
      "**/*.js",
      "**/*.md",
      "**/*.markdown",
      "!_site/**/*",
      "!node_modules/**/*"
    ],
    { interval: 500 },
    buildSite
  );
});

const buildSite = series("buildJekyll", "processStyles");

exports.serve = series(buildSite, "startServer");
exports.default = series(buildSite);