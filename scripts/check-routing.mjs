import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readApp = (file) => readFileSync(join(projectRoot, 'src', 'app', file), 'utf8');

// Import the real native-intent source as an ES module without needing
// a React Native runtime, Babel, Metro, or other dependencies.
const intentCode = readApp('+native-intent.js');
const { redirectSystemPath } = await import(
  `data:text/javascript;base64,${Buffer.from(intentCode).toString('base64')}`
);

const testCases = [
  ['Expo Go startup', 'exp://192.168.1.59:8081/--/', '/'],
  ['Expo Go HTTPS startup', 'exps://example.com/--/', '/'],
  ['Expo Go registration link', 'exp://192.168.1.59:8081/--/register', '/register'],
  ['Expo Go home link', 'exp://192.168.1.59:8081/--/home', '/home'],
  ['Relative Expo Go startup', '/--/', '/'],
  ['Relative Expo Go registration', '/--/register', '/register'],
  ['Server-only Expo Go startup', 'exp://192.168.1.59:8081', '/'],
  ['Normal login route', '/', '/'],
  ['Normal register route', '/register', '/register'],
  ['Normal home route', '/home', '/home'],
  ['Invalid system path', undefined, '/'],
];

for (const [label, actual, expected] of testCases) {
  assert.equal(redirectSystemPath({ path: actual, initial: true }), expected, label);
}

const login = readApp('index.jsx');
const register = readApp('register.jsx');
const rootLayout = readApp('_layout.jsx');
const unmatched = readApp('+not-found.jsx');

assert.match(rootLayout, /<Stack\.Screen\s+name="index"\s*\/>/, 'Login screen must be registered');
assert.match(rootLayout, /<Stack\.Screen\s+name="register"\s*\/>/, 'Register screen must be registered');
assert.match(login, /router\.push\('\/register'\)/, 'Login must navigate to Register');
assert.match(login, /router\.replace\('\/home'\)/, 'Successful mock login must navigate to Home');
assert.match(register, /const handleSubmit\s*=\s*\(\)\s*=>\s*\{\s*(?:\/\/[^\n]*\n\s*)*router\.replace\('\/'\);/,
  'Create Account must replace the route with Login');
assert.match(register, /title="CREATE ACCOUNT"[\s\S]*?onPress=\{handleSubmit\}/,
  'Create Account must call handleSubmit');
assert.match(register, /onPress=\{\(\) => router\.replace\('\/'\)\}/,
  'Sign In link must replace the route with Login');
assert.match(unmatched, /<Redirect\s+href="\/"\s*\/>/, 'Unknown routes must redirect to Login');

console.log(`PASS: ${testCases.length} incoming route cases and 8 screen/navigation checks.`);
