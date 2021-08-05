echo '---------------------'
echo 'Cleaning files...'
rm -rf node_modules
rm -rf npm
rm -rf dist
wait

echo '---------------------'
echo 'Installing dependencies...'
npm i
wait

echo '---------------------'
echo 'Building...'
npm run build
wait

echo '---------------------'
echo 'Preparing "npm" folder to deploy...'
mkdir npm
cp -fR dist npm
cp README.md npm/README.md
cp package.json npm/package.json
rm -rf dist
cd npm

echo '---------------------'
echo 'Getting Git URL...'
GITURL=`git config remote.origin.url`

echo '---------------------'
echo 'Creating Git branch...'
git init
git remote add origin $GITURL
git add .
git commit -am 'npm publish'

echo '---------------------'
echo 'Pushing "npm" branch on Git...'
git push origin master:npm --force
wait

echo '---------------------'
echo 'Cleaning temporary files...'
cd ..
rm -rf npm
wait
