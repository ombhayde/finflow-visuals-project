
# Personal Finance Tracker

A comprehensive personal finance management application that helps you track expenses, manage budgets, and visualize your financial data.

![Personal Finance Tracker](https://github.com/your-username/personal-finance-tracker/raw/main/public/app-screenshot.png)

## Features

- **Transaction Management**: Add, edit, and delete financial transactions
- **Category Management**: Organize transactions with customizable categories
- **Budget Planning**: Set and track monthly budgets by category
- **Visual Analytics**: Multiple charts to visualize your financial data
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Indian Rupee (₹) Support**: All financial data displayed in INR format

## Live Demo

Visit the live application at: [https://finance-tracker.lovable.app](https://finance-tracker.lovable.app)

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### Step 3: Start the Development Server

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

The application will be available at http://localhost:5173

### Step 4: Building for Production

Using npm:
```bash
npm run build
```

Or using yarn:
```bash
yarn build
```

The production-ready files will be generated in the `dist` directory.

## Project Structure

```
/src
  /components
    /budgets      # Budget-related components
    /categories   # Category management components
    /dashboard    # Dashboard and analytics components
    /layout       # Layout components
    /transactions # Transaction management components
    /ui           # UI components from shadcn/ui
  /context       # React context providers
  /data          # Mock data and data utilities
  /hooks         # Custom React hooks
  /pages         # Page components
  /types         # TypeScript type definitions
  /utils         # Utility functions
```

## Technology Stack

- **React** - Frontend library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Recharts** - Data visualization
- **React Router** - Navigation
- **date-fns** - Date manipulation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
