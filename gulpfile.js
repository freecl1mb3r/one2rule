
// ======= SETTINGS ===============================

var listOfLocales = ['en', 'sl', 'ru'];
var packageName = 'CIM 2.0';
var packageVersion = '2.0.0';
var packageCopy = '2015-2016';

// ======= REQUIRE ===============================

const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
//coffee = require('gulp-coffee');
const babel = require('gulp-babel');
const jade = require('gulp-jade');
const less = require('gulp-less');
//const livereload = require('gulp-livereload');
const exec = require('child_process').exec;
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const fsSync = require('fs-extra');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev');
const usemin = require('gulp-usemin');
//const minifyCss = require('gulp-minify-css'); - deprecated
const minifyCss = require('gulp-cssnano');
//const webpack = require('gulp-webpack'); - deprecated
const webpack = require('webpack-stream');
const runSequence = require('run-sequence');

// ======= PATHS ===============================

var paths = {
    jade: ["src/jade/*.jade"],
    less: ["src/less/*.less"],
    esRoot: ["src/js/*.js"],
    esCommon : ["src/js/common/*.js"],
    esApp : ["src/js/app/*.js"],
    esTest : ["src/js/test/*.js"],
    poRoot : ["src/localization/*.po"],
    webpackRoot : ["./src/js/root"],
    webpackCommon : ["./src/js/common/common"],
    webpackApp : ["./src/js/app/app"],
    webpackTest : ["./src/js/test/test"]
}

// ======= WEBPACK CONFIGS (DEV, DEPLOY) ===============================

var webpackDev = function (entry, filename) {
    return {
        devtool: "source-map",
        debug: true,
        watch : false,
        resolve: {
            extensions : [
                '.js',
            ],
            modulesDirectories : [
                'node_modules'
            ]
        },
        module: {
            loaders: [
                { test: /\.js$/, loader: 'babel-loader' }
            ]
        },
        entry : entry,
        output: {
            filename: filename
        }
    }
}
var webpackDeploy = function (entry, filename) {
    return {
        debug: false,
        watch : false,
        resolve: {
            extensions : [
                '.js'
            ],
            modulesDirectories : [
                'node_modules'
            ]
        },
        module: {
            loaders: [
                { test: /\.js$/, loader: 'babel-loader' }
            ]
        },
        entry : entry,
        output: {
            filename: filename
        }
    }
}

// ======= VARIABLES ===============================

var deployInProgress = false;
var localeIdx = -1;
var translations = {}
var date = '2016-01-01 00:00+0200';

var localeHeader = ''
    + '# ' + packageName + ' translation.' + '\n'
    + '# Copyright (C) ' + packageCopy + '\n'
    + '# This file is distributed under the same license as the ' + packageName + ' package.' + '\n'
    + '# Ales Stor <ales.stor@cde.si>, 2016.' + '\n'
    + '#' + '\n'
    + '#, fuzzy' + '\n'
    + 'msgid ""' + '\n'
    + 'msgstr ""' + '\n'
    + '"Project-Id-Version: ' + packageVersion + '\\n"' + '\n'
    + '"Report-Msgid-Bugs-To: CDE Support <support@cde.si>\\n"' + '\n'
    + '"POT-Creation-Date: ' + date + '\\n"' + '\n'
    + '"PO-Revision-Date: ' + date + '\\n"' + '\n'
    + '"Last-Translator: CDE <info@cde.si>\\n"' + '\n'
    + '"Language-Team: CDE <info@cde.si>\\n"' + '\n'
    + '"Language: ${lang}\\n"' + '\n'
    + '"MIME-Version: 1.0\\n"' + '\n'
    + '"Content-Type: text/plain; charset=UTF-8\\n"' + '\n'
    + '"Content-Transfer-Encoding: 8bit\\n"' + '\n'
    + '\n'

// ======= HELPER METHODS ===============================

var showError = function (type, txt) {
    gutil.log(gutil.colors.red('================================================================================'));
    gutil.log(gutil.colors.yellow(type) + ' ' + gutil.colors.red('ERROR at ' + (new Date()).toLocaleTimeString()));
    gutil.log(txt);
    gutil.log(gutil.colors.red('================================================================================'));
    return;
}

var localeJsonMerge = function (cb) {
    var output = "var app = app || {};\napp.locales = app.locales || {};\n";
    var allowWrite = true;

    for (var lang in translations) {
        var translation = translations[lang];
        if (!translation) {
            cb();
            return;
        }
        try {
            obj = JSON.parse(translation);
        } catch (e) {
            console.log(e);
            console.log("Error reading #{lang} translation");
            allowWrite = false;
        }

        if (obj) {
            for (var key in obj) {
                var val = obj[key];
                if (val == '') delete obj[key];
            }

            translations[lang] = JSON.stringify(obj);
        }
    }

    if (allowWrite) {
        var output = '';
        output += "window.app = window.app || {};\n";
        output += "window.app.locales = window.app.locales || {};\n";
        for (var lang in translations) {
            var obj = translations[lang];
            output += "window.app.locales['" + lang + "'] = " + obj + ";\n";
        }
        fs.writeFile("public/js/locales.js", output, 'utf8', function (err) {
            exec("rm -rf src/localization/*.json", function (err) {
                if (!deployInProgress) {
                    //rl.changed();
                }
                cb();
                return;
            });
        });
    } else {
        exec("rm -rf src/localization/*.json", function (err) {
            if (!deployInProgress) {
                //rl.changed();
            }
            cb();
            return;
        });
    }
}

var localeHandler = function (cb) {
    localeIdx++;
    if (localeIdx == 0) {
        translations = {}
    }
    if (localeIdx == listOfLocales.length) {
        localeJsonMerge(cb);
        return;
    }

    var l = listOfLocales[localeIdx];
    console.log('==> locale[' + l + '] - Start');

    // # Generate translation file if not exist
    exec('touch ./src/localization/' + l + '.po', function (err) {
        if (err != null) console.log('==> Generate po if not exist[' + l + '] - err: ' + err + '.');
        // # Generate template (ref.pot.po)
        exec('find ./src/js -iname "*.js" | xargs xgettext -L JavaScript --from-code=UTF-8 -d ./src/localization/' + l + '.pot', function (err) {
            if (err != null) console.log('==> Generate template[' + l + '] - err: ' + err + '.');
            // Read template (ref.pot.po) file content & correct charset header
            fs.readFile('src/localization/' + l + '.pot.po', 'utf8', function (err, data) {
                if (err != null) console.log('==> Pot content[' + l + '] - err: ' + err + '.');
                var poContent = data.replace(/charset\=CHARSET/gi, 'charset=UTF-8');
                // Write .po file content w headers
                fs.writeFile('src/localization/' + l + '.pot.po', poContent, 'utf8', function (err) {
                    if (err != null) console.log('==> Pot content corrected header[' + l + '] - err: ' + err + '.');
                    // # Merge template (ref.pot.po) with existing def.po => def.new.po
                    exec('msgmerge ./src/localization/' + l + '.po ./src/localization/' + l + '.pot.po > ./src/localization/' + l + '.new.po', function (err) {
                        if (err != null) console.log('==> Merge template[' + l + '] - err: ' + err + '.');
                        // # Delete template (ref.pot.po)
                        exec('rm ./src/localization/' + l + '.pot.po', function (err) {
                            if (err != null) console.log('==> Delete template[' + l + '] - err: ' + err + '.');
                            // Read merged .po file content & add headers
                            fs.readFile('src/localization/' + l + '.new.po', 'utf8', function (err, data) {
                                if (err != null) console.log('==> Po content[' + l + '] - err: ' + err + '.');
                                var poContent = (data.indexOf('Project-Id-Version') == -1 ? localeHeader.replace(/\$\{lang\}/gi, l) : '') + data;
                                // Write .po file content w headers
                                fs.writeFile('src/localization/' + l + '.po', poContent, 'utf8', function (err) {
                                    if (err != null) console.log('==> Po content w header[' + l + '] - err: ' + err + '.');
                                    // # Delete new definition (def.new.po)
                                    exec('rm ./src/localization/' + l + '.new.po', function (err) {
                                        if (err != null) console.log('==> Delete def.new.po[' + l + '] - err: ' + err + '.');
                                        // Convert .po files to .json files (i18next-conv)
                                        exec('i18next-conv -l ' + l + ' -s src/localization/' + l + '.po -t src/localization/' + l + '.json', function (err) {
                                            if (err != null) console.log('==> po=>json[' + l + '] - err: ' + err + '.');
                                            // Read .json file content
                                            fs.readFile('src/localization/' + l + '.json', 'utf8', function (err, data) {
                                                if (err != null) console.log('==> Json content[' + l + '] - err: ' + err + '.');
                                                translations[l] = data;
                                                localeHandler(cb);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// ======= TRANSLATION GULP TASKS ===============================

// extract texts like _('Text to be translated') from coffescript files and save them as .po files
// # Generate template (ref.pot.po)
// find ./src/js -iname "*.js" | xargs xgettext -L JavaScript --from-code=UTF-8 -d ./src/localization/en
// # Merge template (ref.pot.po) with existing old.po => old.po
// msgmerge ./src/localization/en.po ./src/localization/en.pot.po > ./src/localization/en.po
// # Delete template (ref.pot.po)
// rm ./src/localization/en.pot.po
gulp.task("locale", function (cb) {
    localeIdx = -1;
    localeHandler(cb);
});

// ======= WEBPACK GULP TASKS - BASIC ===============================

gulp.task("webpackRoot", function () {
    return gulp.src('/')
        .pipe(webpack(webpackDev(paths.webpack, 'root.js')))
        .on('error', function (err) { showError('LESS', err.message); })
        .pipe(gulp.dest('public/js'));
});

gulp.task("webpackApp", function () {
    return gulp.src('/app')
        .pipe(webpack(webpackDev(paths.webpackApp, 'app.js')))
        .on('error', function (err) { showError('LESS', err.message); })
        .pipe(gulp.dest('public/js'));
});

gulp.task("webpackTest", function () {
    return gulp.src('/test')
        .pipe(webpack(webpackDev(paths.webpackTest, 'test.js')))
        .on('error', function (err) { showError('LESS', err.message); })
        .pipe(gulp.dest('public/js'));
});

gulp.task("less", function () {
    return gulp.src(paths.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', function (err) { showError('LESS', err.message); })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("public/css"));
});

gulp.task("jade", function () {
    return gulp.src(paths.jade)
        .pipe(jade({pretty: true}))
        .on('error', function (err) { showError('LESS', err.message); })
        .pipe(gulp.dest("public"));
});

// ======= WEBPACK GULP TASKS - COMPOUND ===============================

gulp.task("root", ["locale", "webpackRoot"], function (cb) {
    cb();
});
gulp.task("app", ["locale", "webpackApp"], function (cb) {
    cb();
});
gulp.task("test", ["locale", "webpackTest" ], function (cb) {
    cb();
});
gulp.task("common", ["webpackTest", "webpackRoot", "webpackApp" ], function (cb) {
    cb();
});
gulp.task("commonWLocale", ["locale", "common" ], function (cb) {
    cb();
});

// ======= GULP WATCHERS ===============================

// watchers - whenever something is changed inside one of the paths below, run tasks accordingly
gulp.task("watch", function () {
    gulp.watch(paths.jade, ["jade"]);
    gulp.watch(paths.esCommon, ["commonWLocale"]);
    gulp.watch(paths.esRoot, ["root"]);
    gulp.watch(paths.esApp, ["app"]);
    gulp.watch(paths.esTest, ["test"]);
    gulp.watch(paths.less, ["less"]);
    gulp.watch(paths.poRoot, ["locale"]);
    return;
});

// ======= DEFAULT GULP TASK ===============================

gulp.task("default", [
  "less",
  "locale",
  "jade",
  "common",
  "watch"
]);


//=============================================================================================
//====   DEPLOY   =============================================================================
//=============================================================================================

gulp.task("deploy-clean-and-copy", [ "deploy-jade", "localesToJson" ], function (cb) {
    fsSync.removeSync('dist');

    // copy only what's necessary to production deploy, there are a lot of unnecessary
    // stuff inside jsbower packages (sources, docs, etc.)
    var strings = '"' + '\n'
        + 'index.html' + '\n'
        + 'img' + '\n'
        + 'COCOS' + '\n'
        + 'ThirdPty' + '\n'
        + 'fonts' + '\n'
        + 'jsbower/open-sans-fontface/fonts/Light' + '\n'
        + 'jsbower/fontawesome/css/font-awesome.min.css' + '\n'
        + 'jsbower/fontawesome/fonts' + '\n'
        + 'jsbower/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css' + '\n'
        + 'jsbower/bootstrap/dist/css/bootstrap.min.css' + '\n'
        + 'jsbower/moment/min/moment.min.js' + '\n'
        + 'jsbower/moment/locale/sl.js' + '\n'
        + 'jsbower/moment/locale/de.js' + '\n'
        + 'jsbower/moment/locale/ru.js' + '\n'
        + 'jsbower/bootstrap/dist/js/bootstrap.min.js' + '\n'
        + 'jsbower/bootstrap/js/collapse.js' + '\n'
        + 'jsbower/bootstrap/js/transition.js' + '\n'
        + 'jsbower/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js' + '\n'
        + 'jsbower/classnames/index.js' + '\n'
        + 'config.js' + '\n'
        + '"';

    var arr = strings.split("\n");
    for (var li = 0; li < arr.length; li++) {
        var x = arr[li];
        console.log('Copying...', 'public/' + x, '==>', 'dist/' + x);
        fsSync.copySync('public/' + x, 'dist/' + x);
    }

    // rename react .min (important!)
    fsSync.copySync('public/jsbower/react/react.min.js', 'dist/jsbower/react/react.js')
    cb();
});

// stupid jquery developers attached sourcemaps to minimized version of jquery
// we don't need sourcemaps on production! that's why we're uglifying jquery ourselves
gulp.task("uglify-jquery", function () {
    gulp.src('public/jsbower/jquery/dist/jquery.js')
        .pipe(uglify())
        .pipe(rename('jquery.js'))
        .pipe(gulp.dest('dist/jsbower/jquery/dist'));
});

gulp.task("deploy-less", function () {
    gulp.src(paths.less)
        .pipe(less())
        .pipe(gulp.dest("public/css"));
});

gulp.task("deploy-webpack", function () {
    gulp.src('/app.js')
        .pipe(webpack(webpackDeploy(paths.webpack, 'app.js')))
        .pipe(gulp.dest('public/js'));
});

gulp.task("deploy-jade", function () {
    gulp.src(paths.jade)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest("public"));
});

//gulp.task "deploy-minify", [ "deploy-clean-and-copy", "deploy-less", "deploy-webpack", "deploy-webpackSession", "deploy-webpackCatiForm" ], ->
gulp.task("deploy-minify", [ "deploy-clean-and-copy", "deploy-less", "deploy-webpack" ], function () {
    gulp.src('public/*.html')
        .pipe(usemin({js: [ uglify(), rev() ], css: [ minifyCss(), 'concat', rev() ]}))
        .pipe(gulp.dest('dist/'));
});

gulp.task("deploy-finished", function (cb) {
    deployInProgress = false;
    cb();
});

gulp.task("deploy", function (cb) {
    deployInProgress = true;
    // optimization: only if we're running deploy on clean version (right after we pulled it from git), we don't need to run
    // aditional development webpacks ('webpack', 'webpackLogin', 'webpackRight', 'webpackSession') which also produce sourcemaps
    // this is meant to deploy stable version quicker
    // app.js.map is produced by gulp watcher (which we use under development)
    if (fs.existsSync('public/js/app.js.map')) {
        // development version - we have to generate source maps again after we're done with production deploy
        //runSequence 'deploy-minify', 'uglify-jquery', 'webpack', 'webpackLogin', 'webpackRight', 'webpackSession', 'deploy-finished', cb
        runSequence('deploy-minify', 'uglify-jquery', 'webpack', 'deploy-finished', cb);
    } else {
        runSequence('deploy-minify', 'uglify-jquery', 'deploy-finished', cb);
    }
});

// if something goes wrong when compiling .coffe, .jade, .less, show error in RED!
process.on("uncaughtException", function (err) {
    for (var li = 0; li < 2; li++) {
        gutil.log(gutil.colors.red('=== UNCAUGHT ERROR =========================================================================='));
    }
    console.log("\n\n\n");
    console.error("Caught exception: " + err);
    process.exit();
});
