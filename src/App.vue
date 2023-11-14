<template>
  <router-view />
</template>

<script></script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&display=swap');
:root {
  --primary-color: rgb(182, 56, 56);
  --secondary-color: rgb(144, 16, 16);
  --line-color: lightgray;
  --shadow: 4px 4px 7px lighgray;
  --black: #333333;
  --body-font: sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  color: #333333;
}

body {
  font-family: var(--body-font);
}

.logo-volpak {
  width: 150px;
}

.button {
  border: none;
  border-radius: 5px;
  padding: 1em 0.5em;
  transition: all 300ms;
  cursor: pointer;
  text-decoration: none;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
}

.primary-button:hover {
  background-color: var(--secondary-color);
}

.secondary-button {
  background-color: white;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.secondary-button:hover {
  background-color: var(--secondary-color);
  color: white;
}

input[type='text'],
input[type='password'] {
  border: none;
  border-bottom: 1px solid var(--line-color);
  padding: 1em;
}

.error-message {
  color: red;
}

.nav-link {
  color: var(--black);
  text-decoration: none;
  font-weight: 700;
}
.nav-link:hover {
  color: var(--primary-color);
}
.router-link-exact-active {
  color: var(--primary-color);
}

.doc-link {
  background-color: #f5f5f5;
  padding: 1em;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  color: var(--black);
  transition: all 300ms;
}
.doc-link:hover {
  transform: translateX(5px);
}
.doc-link span {
  color: var(--primary-color);
  font-weight: 900;
}
</style>
