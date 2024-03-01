# Svelte Hemicycle

A data visualisation for the South African elections as a Svelte component. It accepts data as a JSON property from the IEC's NPE Seat Calculation Results API and renders a hemicycle chart.

![Hemicycle](https://github.com/j-norwood-young/svelte-hemicycle/blob/main/src/assets/hemicycle.png)

## Demo

[See the hemicycle with South African national elections data here](https://j-norwood-young.github.io/svelte-hemicycle/)

## Installation

```bash
npm install svelte-hemicycle
```

## Usage

```svelte
<script>
  import Hemicycle from 'svelte-hemicycle';
  const data = [
      {
          "id": 1,
          "text": "UDFMP",
          "count": 160,
          "color": "#FF0000"
      },
      {
          "id": 2,
          "text": "PDMF",
          "count": 150,
          "color": "#00FF00"
      },
      {
          "id": 3,
          "text": "DA",
          "count": 40,
          "color": "#0000FF"
      },
      {
          "id": 4,
          "text": "PDP",
          "count": 30,
          "color": "#FFFF00"
      },
      {
          "id": 5,
          "text": "APC",
          "count": 20,
          "color": "#00FFFF"
      }
  ]
  const total_seats = 400;
  const rows= 12;
</script>

<Hemicycle {data} {total_seats} {rows} />
```

## API

### data

The data to display on the hemicycle. This is an array of objects, each representing a party or group of seats.

Required.

```javascript
data = [{
    "id": 1, // Unique identifier
    "text": "UDFMP (60 seats)", // Text to display on the hemicycle
    "count": 60, // Number of seats
    "color": "#FF0000" // Colour of the hemicycle segment
}]
```

### total_seats

The total number of seats in the legislature. This can be greater than the total number of seats in the data.

Required.

```javascript
total_seats = 400;
```

### r

The radius of the hemicycle.

Default: 300

```javascript
r = 300;
```

### rows

The number of rows of seats to display.

Default: 12

```javascript
rows = 12;
```

### dotsize

The size of the dots representing seats.

Default: 5

### arc

The angle of the hemicycle, in degrees.

Default: 180
Minimum: 10
Maximum: 360


### padding

The padding between the hemicycle and the edge of the SVG. 

```javascript
padding = 30;
padding = [30, 30]; // top, bottom
padding = [30, 30, 30, 30]; // top, right, bottom, left
```

### color

The colour of the text and optional markings.

Default: "white"

### font_size

The font size of the text.

Default: 12

### text_position

The position of the text.

Defaults to center.

```javascript
text_position = {
    x: 0,
    y: 0
}
```

### display

An array of strings representing what to display on the hemicycle.

Defaults to ["points", "text"]

"points" - Display the dots of seats
"text" - Display the text on mouseover and click
"arc" - Display the arcs of the hemicycle
"numbers" - Display the seats in order
"voronoi" - Display the voronoi diagram
"referencePoints" - Display some reference points

```javascript
display = ["points", "text"]; // Default
display = ["points", "text", "arc", "numbers", "voronoi", "referencePoints"]; // All
```

## License

MIT

```
Copyright 2024 Jason Norwood-Young

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```