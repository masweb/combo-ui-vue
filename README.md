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
import { createApp } from 'vue'
import { ComboUIPlugin } from 'combo-ui-vue'
import theme from './theme.json'

const app = createApp(App)
app.use(ComboUIPlugin, { theme })
```

### Opciones del plugin

```ts
app.use(ComboUIPlugin, {
  theme,
  darkMode: 'auto', // 'auto' | 'light' | 'dark'
  persistDarkMode: true, // guarda preferencia en localStorage
  darkModeStorageKey: 'cui-dark-mode',
  reset: true, // inyecta CSS reset
  autoInit: true, // inicializa automáticamente
  ws: 'ws://localhost:3001' // sincronización en tiempo real vía WebSocket
})
```

## Composable

```ts
import { useComboUI } from 'combo-ui-vue'

const { isInitialized, isDark, instance, toggleDarkMode, setDarkMode, updateTheme } = useComboUI()
```

| Propiedad        | Tipo                         | Descripción                            |
| ---------------- | ---------------------------- | -------------------------------------- |
| `isInitialized`  | `Readonly<Ref<boolean>>`     | Indica si ComboUI está inicializado    |
| `isDark`         | `Readonly<Ref<boolean>>`     | Estado actual del modo oscuro          |
| `instance`       | `ComboUI \| null`            | Instancia interna de ComboUI           |
| `toggleDarkMode` | `() => void`                 | Alterna entre modo claro y oscuro      |
| `setDarkMode`    | `(value: boolean \| 'auto')` | Establece el modo oscuro               |
| `updateTheme`    | `(theme: ThemeData) => void` | Actualiza el tema completo en caliente |

## Componentes

### ThemeToggler

Botón para alternar entre modo claro y oscuro. Incluye iconos sol/luna por defecto (Tabler Icons), totalmente configurable via slots.

#### Uso básico

```vue
<script setup>
import { ThemeToggler } from 'combo-ui-vue'
</script>

<template>
  <ThemeToggler />
</template>
```

#### Iconos personalizados via props

```vue
<ThemeToggler icon-light="<svg>...</svg>" icon-dark="<svg>...</svg>" />
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

#### Props

| Prop        | Type   | Default  | Descripción                              |
| ----------- | ------ | -------- | ---------------------------------------- |
| `iconLight` | String | Sun SVG  | SVG para modo light (se muestra en dark) |
| `iconDark`  | String | Moon SVG | SVG para modo dark (se muestra en light) |

#### Slots

| Slot      | Props                                 | Descripción                                   |
| --------- | ------------------------------------- | --------------------------------------------- |
| `default` | `{ isDark: boolean, toggleDarkMode }` | Reemplaza el botón completo                   |
| `light`   | —                                     | Contenido/icono mostrado cuando está en dark  |
| `dark`    | —                                     | Contenido/icono mostrado cuando está en light |

---

## Uso de estilos CSS

ComboUI inyecta CSS automáticamente a partir del tema. Los componentes se usan directamente con clases CSS en tu HTML/Vue.

### Convención de clases

- Clase base: `cui-{componente}`
- Variante: `--{nombre-variante}` (se convierte a kebab-case)
- Modo oscuro: se aplica automáticamente vía `body[color-scheme="dark"]`

---

### Button

```html
<button class="cui-button --primary">Primary</button>
<button class="cui-button --secondary">Secondary</button>
<button class="cui-button --primary" disabled>Disabled</button>
```

Los estados `:hover`, `:active`, `:focus-visible` y `:disabled` se gestionan automáticamente vía CSS.

---

### Card

```html
<div class="cui-card --default">
  <div class="cui-card-header">Título</div>
  <div class="cui-card-body">Contenido de la tarjeta.</div>
  <div class="cui-card-footer">Pie de tarjeta</div>
</div>
```

| Sub-elemento       | Descripción            |
| ------------------ | ---------------------- |
| `.cui-card-header` | Cabecera de la tarjeta |
| `.cui-card-body`   | Cuerpo de la tarjeta   |
| `.cui-card-footer` | Pie de la tarjeta      |

---

### Alert

```html
<div class="cui-alert --success">
  <div class="cui-alert-header">
    <span>¡Éxito!</span>
    <button class="cui-alert-close">
      <svg>...</svg>
    </button>
  </div>
  <div class="cui-alert-body">Operación completada correctamente.</div>
</div>
```

La posición se define en la variante del tema (`variant.position`) y se aplica automáticamente como `position: fixed` con el offset correspondiente. Valores disponibles: `top-left`, `top-center`, `top-right`, `center-left`, `center-center`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right`.

| Sub-elemento        | Descripción           |
| ------------------- | --------------------- |
| `.cui-alert-header` | Cabecera de la alerta |
| `.cui-alert-body`   | Cuerpo del mensaje    |
| `.cui-alert-close`  | Botón de cerrar       |

---

### Avatar

```html
<!-- Con imagen + online -->
<div class="cui-avatar-wrapper">
  <div class="cui-avatar --primary">
    <img src="https://i.pravatar.cc/300" alt="" />
  </div>
  <div class="cui-avatar-online"></div>
</div>

<!-- Con iniciales -->
<div class="cui-avatar-wrapper">
  <div class="cui-avatar --secondary">
    <span class="cui-avatar-initials">AB</span>
  </div>
  <div class="cui-avatar-online"></div>
</div>
```

El tamaño (`size`, ancho y alto) se define en cada variante del tema.

La imagen se usa con una etiqueta `<img>` — el CSS aplica `object-fit: cover`.

El wrapper `.cui-avatar-wrapper` es necesario para posicionar el indicador online fuera del avatar (el avatar tiene `overflow: hidden`). El indicador `.cui-avatar-online` es hermano del avatar, se configura en la variante: posición, color, tamaño y desplazamiento.

| Sub-elemento           | Descripción                |
| ---------------------- | -------------------------- |
| `.cui-avatar-initials` | Texto con iniciales        |
| `.cui-avatar-online`   | Indicador de estado online |

---

### Badge

```html
<span class="cui-badge --primary">Nuevo</span> <span class="cui-badge --secondary">42</span>
```

---

### Tooltip

La posición de la flecha se define en cada variante del tema (`placement`: `top`, `bottom`, `left`, `right`). La variante ya incluye la posición, no se necesita atributo extra.

#### Uso con clases CSS

```html
<span class="cui-tooltip-wrapper">
  <button>Pasa el ratón</button>
  <span class="cui-tooltip --primary">Texto del tooltip</span>
</span>
```

El wrapper `.cui-tooltip-wrapper` gestiona la visibilidad automática al hacer hover o focus. El tooltip se posiciona según el `placement` de la variante.

#### Uso con componente Vue

```vue
<script setup>
import { Tooltip } from 'combo-ui-vue'
</script>

<template>
  <!-- Con prop text -->
  <Tooltip variant="primary" text="Tooltip desde prop">
    <button>Pasa el ratón</button>
  </Tooltip>

  <!-- Con slot content -->
  <Tooltip variant="primary">
    <button>Pasa el ratón</button>
    <template #content>Contenido <strong>enriquecido</strong></template>
  </Tooltip>
</template>
```

#### Props

| Prop      | Type   | Required | Descripción                    |
| --------- | ------ | -------- | ------------------------------ |
| `variant` | String | Sí       | Nombre de la variante del tema |
| `text`    | String | No       | Texto del tooltip              |

#### Slots

| Slot      | Descripción                                  |
| --------- | -------------------------------------------- |
| `default` | Elemento que activa el tooltip (trigger)     |
| `content` | Contenido del tooltip (alternativa a `text`) |

---

### Popover

La posición se define en cada variante del tema (`placement`: `top`, `bottom`, `left`, `right`). Se activa con **click** — el wrapper usa `:focus-within` para mostrar/ocultar el popover automáticamente cuando el trigger (un elemento focuseable como `<button>`) recibe o pierde el foco.

#### Uso con clases CSS

```html
<span class="cui-popover-wrapper">
  <button class="cui-button --v1">Click me</button>
  <div class="cui-popover --v1">
    <div class="cui-popover-inset-overlay"></div>
    <div class="cui-popover-inner">
      <div class="cui-popover-header">Título</div>
      <div class="cui-popover-body">Contenido del popover.</div>
    </div>
  </div>
</span>

<span class="cui-popover-wrapper">
  <button class="cui-button --v2">Secondary</button>
  <div class="cui-popover --v2">
    <div class="cui-popover-inset-overlay"></div>
    <div class="cui-popover-inner">
      <div class="cui-popover-header">Título</div>
      <div class="cui-popover-body">Contenido del popover.</div>
    </div>
  </div>
</span>
```

El wrapper `.cui-popover-wrapper` gestiona la visibilidad automática via `:focus-within`. El popover se posiciona según el `placement` de la variante y usa el ancho configurado en `max-width`. Las sombras interiores (inset) se renderizan en la capa `.cui-popover-inset-overlay` y las exteriores (offset) en el contenedor principal.

#### Uso con componente Vue

```vue
<script setup>
import { Popover } from 'combo-ui-vue'
</script>

<template>
  <!-- Con prop title -->
  <Popover variant="v1" title="Título del popover">
    <button class="cui-button --v1">Click me</button>
  </Popover>

  <!-- Con slots header y body -->
  <Popover variant="v2">
    <button class="cui-button --v2">Click me</button>
    <template #header>Título <strong>personalizado</strong></template>
    <template #body>Contenido enriquecido del popover.</template>
  </Popover>
</template>
```

El componente Vue usa Teleport para renderizar el popover en `<body>`, evitando problemas de desbordamiento y herencia de ancho del contenedor padre. El posicionamiento se calcula automáticamente via JavaScript.

#### Props

| Prop      | Type   | Required | Descripción                    |
| --------- | ------ | -------- | ------------------------------ |
| `variant` | String | Sí       | Nombre de la variante del tema |
| `title`   | String | No       | Título del popover             |

#### Slots

| Slot      | Descripción                                  |
| --------- | -------------------------------------------- |
| `default` | Elemento que activa el popover (trigger)     |
| `header`  | Cabecera del popover (alternativa a `title`) |
| `body`    | Cuerpo del popover                           |

| Sub-elemento                 | Descripción                          |
| ---------------------------- | ------------------------------------ |
| `.cui-popover-inner`         | Contenedor con `overflow: hidden`    |
| `.cui-popover-header`        | Cabecera del popover                 |
| `.cui-popover-body`          | Cuerpo del popover                   |
| `.cui-popover-inset-overlay` | Capa para sombras interiores (inset) |

---

### Chip

```html
<span class="cui-chip --default">
  Etiqueta
  <button class="cui-chip-close">
    <svg>...</svg>
  </button>
</span>
```

| Sub-elemento      | Descripción       |
| ----------------- | ----------------- |
| `.cui-chip-close` | Botón de eliminar |

---

### Progress

```html
<!-- Barra básica -->
<div class="cui-progress --primary">
  <div class="cui-progress-fill" style="width: 60%"></div>
</div>

<!-- Con etiqueta -->
<div class="cui-progress --primary">
  <div class="cui-progress-fill" style="width: 75%"></div>
  <span class="cui-progress-label">75%</span>
</div>

<!-- Con rayas animadas -->
<div class="cui-progress --primary">
  <div class="cui-progress-fill --striped --animated" style="width: 50%"></div>
</div>
```

| Sub-elemento          | Descripción          |
| --------------------- | -------------------- |
| `.cui-progress-fill`  | Barra de progreso    |
| `.cui-progress-label` | Texto con porcentaje |

Modificadores de `.cui-progress-fill`: `--striped`, `--animated`.

---

### Spinner

El componente Spinner renderiza automáticamente el tipo de animación (ring, pulse, dots, bars, dual) configurado en la variante del tema. No necesitas especificar manualmente el HTML/SVG.

#### Uso con componente Vue

```vue
<script setup>
import { Spinner } from 'combo-ui-vue'
</script>

<template>
  <!-- Uso básico -->
  <Spinner variant="v1" />
  
  <!-- Con clases adicionales -->
  <Spinner variant="primary" class="ml-2" />
  
  <!-- Múltiples variantes con diferentes tipos -->
  <Spinner variant="v1" /> <!-- tipo: ring -->
  <Spinner variant="v2" /> <!-- tipo: dots -->
  <Spinner variant="v3" /> <!-- tipo: bars -->
</template>
```

#### Props

| Prop      | Type   | Required | Descripción                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| `variant` | String | Sí       | Nombre de la variante del tema (ej: 'v1')   |
| `class`   | String | No       | Clases CSS adicionales                      |

#### Tipos disponibles

El tipo de spinner se configura en el editor de temas para cada variante:

- `ring` - Anillo giratorio
- `pulse` - Círculos pulsantes
- `dots` - Tres puntos rebotando
- `bars` - Cinco barras estirándose
- `dual` - Dos anillos girando en direcciones opuestas

El componente lee automáticamente el `type` de la variante y renderiza el HTML/SVG correspondiente.

---

### Table

```html
<div class="cui-table --default --striped-rows --hoverable">
  <table>
    <thead>
      <tr class="cui-table-header-row">
        <th class="cui-table-header">Nombre</th>
        <th class="cui-table-header">Email</th>
      </tr>
    </thead>
    <tbody>
      <tr class="cui-table-row">
        <td class="cui-table-cell">Ana García</td>
        <td class="cui-table-cell">ana@ejemplo.com</td>
      </tr>
      <tr class="cui-table-row">
        <td class="cui-table-cell">Carlos López</td>
        <td class="cui-table-cell">carlos@ejemplo.com</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="cui-table-footer-row">
        <td class="cui-table-footer" colspan="2">2 usuarios</td>
      </tr>
    </tfoot>
  </table>
</div>
```

Modificadores: `--striped-rows`, `--striped-cols`, `--hoverable`, `--borders-separate`.

| Sub-elemento            | Descripción      |
| ----------------------- | ---------------- |
| `.cui-table-header-row` | Fila de cabecera |
| `.cui-table-header`     | Celda `<th>`     |
| `.cui-table-row`        | Fila del cuerpo  |
| `.cui-table-cell`       | Celda `<td>`     |
| `.cui-table-footer-row` | Fila del pie     |
| `.cui-table-footer`     | Celda del pie    |

---

### ListGroup

```html
<div class="cui-listgroup --default">
  <ul class="cui-listgroup-items">
    <li class="cui-listgroup-item --active">Elemento activo</li>
    <li class="cui-listgroup-item">Elemento normal</li>
    <li class="cui-listgroup-item --disabled">Elemento deshabilitado</li>
  </ul>
</div>

<!-- Numerada -->
<div class="cui-listgroup --default">
  <ol class="cui-listgroup-items">
    <li class="cui-listgroup-item"><span class="cui-listgroup-item-number">1.</span> Primer paso</li>
    <li class="cui-listgroup-item"><span class="cui-listgroup-item-number">2.</span> Segundo paso</li>
  </ol>
</div>

<!-- Flush (sin bordes ni radius) -->
<div class="cui-listgroup --default --flush">
  <ul class="cui-listgroup-items">
    <li class="cui-listgroup-item">Elemento A</li>
    <li class="cui-listgroup-item">Elemento B</li>
  </ul>
</div>
```

Modificadores: `--flush` (elimina bordes y radius).

| Sub-elemento                 | Descripción              |
| ---------------------------- | ------------------------ |
| `.cui-listgroup-items`       | Contenedor `<ul>`/`<ol>` |
| `.cui-listgroup-item`        | Elemento de la lista     |
| `.cui-listgroup-item-number` | Número de orden          |

Estados en `.cui-listgroup-item`: `--active`, `--disabled`.

---

### Accordion

```html
<div class="cui-accordion --default">
  <div class="cui-accordion-item">
    <button class="cui-accordion-button --active">
      Sección 1
      <svg class="cui-accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <div class="cui-accordion-body">Contenido de la sección 1.</div>
  </div>
  <div class="cui-accordion-item">
    <button class="cui-accordion-button">
      Sección 2
      <svg class="cui-accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <div class="cui-accordion-body">Contenido de la sección 2.</div>
  </div>
</div>
```

| Sub-elemento             | Descripción                 |
| ------------------------ | --------------------------- |
| `.cui-accordion-item`    | Cada sección colapsable     |
| `.cui-accordion-button`  | Botón de toggle             |
| `.cui-accordion-body`    | Panel de contenido          |
| `.cui-accordion-chevron` | Icono de flecha (rota 180°) |

Estado en `.cui-accordion-button`: `--active` (expandido).

---

### Pagination

```html
<nav class="cui-pagination --default">
  <span class="cui-pagination-item --disabled">&laquo;</span>
  <span class="cui-pagination-item --active">1</span>
  <span class="cui-pagination-item">2</span>
  <span class="cui-pagination-item">3</span>
  <span class="cui-pagination-item">&raquo;</span>
</nav>
```

| Sub-elemento           | Descripción       |
| ---------------------- | ----------------- |
| `.cui-pagination-item` | Cada botón/página |

Estados en `.cui-pagination-item`: `--active`, `--disabled`.

---

### Typography

```html
<h1 class="cui-h1">Título principal</h1>
<h2 class="cui-h2">Subtítulo</h2>
<h3 class="cui-h3">Sección</h3>
<p class="cui-body">Texto del cuerpo del documento.</p>
<span class="cui-small">Texto pequeño</span>
<span class="cui-caption">Texto de pie de foto</span>
<a class="cui-link" href="#">Enlace</a>
```

Las clases tipográficas se generan a partir de las variantes definidas en el tema: `cui-h1`–`cui-h6`, `cui-body`, `cui-small`, `cui-caption`, `cui-link`, `cui-display`.

---

### Forms

```html
<!-- Input -->
<div class="cui-field">
  <label class="cui-label">Nombre</label>
  <input class="cui-input" placeholder="Introduce tu nombre" />
</div>

<!-- Input con error -->
<div class="cui-field">
  <label class="cui-label">Email</label>
  <input class="cui-input cui-error" aria-invalid="true" />
  <div class="cui-error-message">El email es obligatorio</div>
</div>

<!-- Select -->
<div class="cui-field">
  <label class="cui-label">País</label>
  <select class="cui-select">
    <option>España</option>
    <option>México</option>
  </select>
</div>

<!-- Textarea -->
<div class="cui-field">
  <label class="cui-label">Mensaje</label>
  <textarea class="cui-textarea" rows="4"></textarea>
</div>

<!-- Checkbox -->
<div class="cui-field">
  <div class="cui-option-group">
    <label class="cui-checkbox">
      <input type="checkbox" />
      <span class="cui-option-label">Acepto los términos</span>
    </label>
  </div>
</div>

<!-- Radio -->
<div class="cui-field">
  <label class="cui-label">Plan</label>
  <div class="cui-option-group">
    <label class="cui-radio">
      <input type="radio" name="plan" />
      <span class="cui-option-label">Básico</span>
    </label>
    <label class="cui-radio">
      <input type="radio" name="plan" />
      <span class="cui-option-label">Premium</span>
    </label>
  </div>
</div>

<!-- Dropzone -->
<div class="cui-field">
  <div class="cui-dropzone">Arrastra archivos aquí o haz clic</div>
</div>
```

| Sub-elemento         | Descripción                  |
| -------------------- | ---------------------------- |
| `.cui-label`         | Etiqueta del campo           |
| `.cui-input`         | Campo de texto               |
| `.cui-select`        | Lista desplegable            |
| `.cui-textarea`      | Área de texto multilinea     |
| `.cui-checkbox`      | Wrapper de checkbox          |
| `.cui-radio`         | Wrapper de radio             |
| `.cui-option-label`  | Texto junto a checkbox/radio |
| `.cui-option-group`  | Grupo de opciones            |
| `.cui-dropzone`      | Zona de subida de archivos   |
| `.cui-error-message` | Mensaje de error             |

---

## API Avanzada

### Inicialización manual

```ts
import { initComboUI, destroyComboUI } from 'combo-ui-vue'

// Inicializar
const instance = await initComboUI({
  theme: '/themes/default.json',
  darkMode: 'auto',
  ws: 'ws://localhost:3001'
})

// Destruir
destroyComboUI()
```

### Actualizar tema en caliente

```ts
const { updateTheme } = useComboUI()

// Al recibir un tema nuevo (por ejemplo vía WebSocket)
updateTheme(newThemeData)
```

### Acceso directo a la instancia

```ts
import { getComboUI } from 'combo-ui-vue'

const instance = getComboUI()

// Acceder a la API completa
instance.isDark
instance.setDarkMode(true)
instance.toggleDarkMode()
instance.onDarkModeChange(isDark => console.log(isDark))
instance.updateButtonVariant('primary', { background: '#ff0000' })

// WebSocket sync
instance.connectSync()
instance.disconnectSync()
instance.onSyncConnect(() => console.log('connected'))
```
