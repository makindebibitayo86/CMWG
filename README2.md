# CMWG — Travel & Merch Platform

A React-based travel booking and merchandise platform with Google Sheets as the backend database and Formspree for email notifications.

---

## Stack

- **Frontend** — React (JSX), deployed on Netlify via GitHub
- **Backend** — Google Apps Script (Web App), connected to Google Sheets
- **Email** — Formspree
- **Media** — Cloudinary (images & videos)

---

## Project Structure

```
├── Destinations.jsx      # Destinations page — browse, filter, book
├── Merch.jsx             # Merch store — browse, order
├── Code.gs               # Google Apps Script — handles all reads/writes
```

---

## How It Works

### Destinations & Bookings
- Destinations are loaded from the `destinations` sheet via `doGet`
- Users browse, filter by category, open a modal, and fill a booking enquiry form
- On submit, the booking is written to the `bookings` sheet and an email is sent via Formspree

### Merch
- Products are loaded from the `merch` sheet via `doGet`
- Users browse by category, open a product modal, and place an order
- On submit, the order is written to the `orders` sheet and an email is sent via Formspree

---

## Google Sheets Structure

### `destinations`
| id | title | desc | tagline | price | img | video | category | highlights | bestTime | duration |

### `bookings`
| timestamp | destination | name | phone | email | date | travellers | budget | message |

### `merch`
| id | name | price | tag | desc | category | imgs | fields |

### `orders`
| timestamp | product | category | price | name | phone | email | size | sleeve | height | age | note |

---

## Apps Script Endpoints

**Base URL:**
```
https://script.google.com/macros/s/AKfycbwC3KdhH5lRljjcAZ9DD5Jsqhp3rKPHkSadO0hXrH0iFjEIUh0JKCy0qxsvFcxkN9OEvw/exec
```

| Method | Param / Type | Action |
|--------|-------------|--------|
| GET | `?type=destinations` | Fetch all destinations |
| GET | `?type=bookings` | Fetch all bookings |
| GET | `?type=merch` | Fetch all merch products |
| GET | `?type=orders` | Fetch all orders |
| POST | `type: 'booking'` | Save booking enquiry |
| POST | `type: 'merch_order'` | Save merch order |
| POST | `type: 'save_destinations'` | Overwrite destinations data |
| POST | `type: 'save_merch'` | Overwrite merch data |

---

## Notifications

All form submissions (bookings + merch orders) send an email via Formspree to the same inbox.

**Formspree endpoint:** `https://formspree.io/f/mbdegokk`

- Booking email subject: `New Booking Enquiry — [Destination]`
- Merch email subject: `New Merch Order — [Product]`

---

## Deploying Changes

### Frontend
1. Push changes to GitHub
2. Netlify auto-deploys on push to main

### Apps Script (Code.gs)
1. Open [script.google.com](https://script.google.com)
2. Make changes to `Code.gs`
3. **Deploy → Manage deployments → Edit → New version → Deploy**
4. Do NOT create a new deployment — always update the existing one to keep the URL the same

---

## Notes

- If a sheet tab doesn't exist, the script creates it automatically on first submission
- The `bookings` and `orders` sheets are append-only — never delete the header row
- Merch `imgs` field uses `|` as a separator for multiple image URLs
- Destination `highlights` field uses `|` as a separator for multiple highlight strings
