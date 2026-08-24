
export const PERMISSIONS = {
  rooms: {
    create: ["admin"],
    update: ["admin"],
    delete: ["admin"],
    // view: ["customer", "staff", "admin"],
  },

  bookings: {
    create: ["customer", "staff", "admin"],
    viewOwn: ["customer", "staff", "admin"],
    viewAll: ["staff", "admin"],
    update: ["staff", "admin"],
    cancel: ["customer", "staff", "admin"],
  },
};

