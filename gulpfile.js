const gulp = require('gulp'); // eslint-disable-line @typescript-eslint/no-var-requires
const cp = require('child_process'); // eslint-disable-line @typescript-eslint/no-var-requires

const server_dir = '../java-debug';

gulp.task('build_server', () => {
  cp.execSync(mvnw() + ' clean package', {
    cwd: server_dir,
    stdio: [0, 1, 2],
  });
  return gulp
    .src(server_dir + '/com.microsoft.java.debug.plugin/target/com.microsoft.java.debug.*.jar')
    .pipe(gulp.dest('./server'));
});

function isWin() {
  return /^win/.test(process.platform);
}

function mvnw() {
  return isWin() ? 'mvnw.cmd' : './mvnw';
}
