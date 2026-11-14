# FitZone - Advanced Responsive Fitness E-commerce Website

FitZone is a front-end college project for a fitness equipment store. It contains seven connected pages and uses HTML, CSS, JavaScript and Bootstrap 5.

## Project folder structure

```text
FitZone/
├── index.html                 # Home page
├── pages/
│   ├── products.html          # Product catalogue, search and category filter
│   ├── workout.html           # Workout information
│   ├── about.html             # About the store
│   ├── contact.html           # Contact form
│   ├── cart.html              # Shopping cart
│   └── order.html             # Demo checkout form
├── assets/
│   ├── css/
│   │   └── style.css          # All website styles
│   ├── js/
│   │   └── script.js          # Product, cart and form functionality
│   └── images/                # Add local images here if required
└── README.md
```

## How to run the project

1. Extract the ZIP file.
2. Open the extracted `FitZone` folder in Visual Studio Code.
3. Open `index.html`.
4. Right-click and choose **Open with Live Server** (Live Server extension required).
5. Use the navigation bar to visit all seven pages.

You can also open `index.html` directly in a browser. An internet connection is needed for Bootstrap, Bootstrap Icons, Google Fonts and the remote product photographs used by this demo.

## Main features

- Responsive layout for desktop, tablet and mobile screens.
- Seven connected website pages.
- Product catalogue with live search and category filtering.
- Add-to-cart buttons and a cart stored in browser `localStorage`.
- Increase, decrease and remove cart quantities.
- Checkout summary and browser form validation.
- Contact form success message.
- Responsive navigation and animated page elements.

## Code organization

- HTML files contain the page structure and content.
- `assets/css/style.css` contains the styling, grouped into readable CSS rules.
- `assets/js/script.js` contains the JavaScript, divided into numbered sections with comments.
- Indentation and line breaks have been applied so the code is easy to read and edit.

## Important project note

This is a front-end demonstration. Cart data is stored in the browser using `localStorage`. The checkout form displays a demo confirmation only; it is not connected to a real payment gateway, server or database.
