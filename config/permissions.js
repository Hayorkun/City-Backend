export const PERMISSIONS = {
  rooms: {
    create: ["admin"],
    update: ["admin"],
    delete: ["admin"],
    viewAll: ["staff", "admin"],
  },

  bookings: {
    create: ["customer", "staff", "admin"],
    viewOwn: ["customer", "staff", "admin"],
    viewAll: ["staff", "admin"],
    update: ["staff", "admin"],
    cancel: ["customer", "staff", "admin"],
  },

  users: {
    update: ["admin"],
    transfer: ["admin"]
  },

  payments: {
    pay: ["customer"],
    recordManual: ["staff", "admin"],
  }

};
