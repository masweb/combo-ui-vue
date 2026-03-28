# COMBO-UI VUE

Paquete para utilizar los temas de [COMBO-UI Editor](https://github.com/masweb/combo-ui-editor) en aplicaciones Vue 3.

#### npm

```bash
npm install combo-ui-vue
```

#### pnpm

```bash
pnpm install combo-ui-vue
```

## Setup

```ts
// main.ts
import { createApp } from "vue";
import { ComboUIPlugin } from "combo-ui-vue";
import theme from "./theme.json";

const app = createApp(App);
app.use(ComboUIPlugin, { theme });
```

## Composable

```ts
import { useComboUI } from "combo-ui-vue";

const { isDark, toggleDarkMode, setDarkMode } = useComboUI();
```

## Components

### ThemeToggler

Componente para toggle dark/light. Botón con iconos sol/luna por defecto, totalmente configurable via slots.

#### Uso básico

```vue
<script setup>
import { ThemeToggler } from "combo-ui-vue";
</script>

<template>
  <ThemeToggler />
</template>
```

#### Iconos personalizados via props

```vue
<ThemeToggler
  icon-light="<svg>...</svg>"
  icon-dark="<svg>...</svg>"
/>
```

#### Iconos personalizados via slots

```vue
<ThemeToggler>
  <template #light>🌙</template>
  <template #dark>☀️</template>
</ThemeToggler>
```

#### Trigger completamente custom via slot default

```vue
<ThemeToggler v-slot="{ isDark, toggleDarkMode }">
  <button class="cui-button --primary" @click="toggleDarkMode">
    {{ isDark ? "☀️" : "🌙" }}
  </button>
</ThemeToggler>
```

```vue
<ThemeToggler v-slot="{ isDark, toggleDarkMode }">
  <button class="cui-button --primary" @click="toggleDarkMode">
    <IconSun v-if="isDark" />
    <IconMoon v-else />
  </button>
</ThemeToggler>
```

#### Props

| Prop        | Type   | Default  | Description                              |
| ----------- | ------ | -------- | ---------------------------------------- |
| `iconLight` | String | Sun SVG  | SVG para modo light (se muestra en dark) |
| `iconDark`  | String | Moon SVG | SVG para modo dark (se muestra en light) |

#### Slots

| Slot      | Props                                 | Description                                   |
| --------- | ------------------------------------- | --------------------------------------------- |
| `default` | `{ isDark: boolean, toggleDarkMode }` | Reemplaza el botón completo                   |
| `light`   | —                                     | Contenido/icono mostrado cuando está en dark  |
| `dark`    | —                                     | Contenido/icono mostrado cuando está en light |
