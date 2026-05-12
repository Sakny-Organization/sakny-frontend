const PROPERTY_STORAGE_KEY = "sakny:properties";

export const PROPERTY_TYPES = [
  "bed",
  "room",
  "apartment",
  "studio",
  "house",
  "duplex",
  "villa",
  "chalet",
];
export const PROPERTY_STATUSES = {
  AVAILABLE: "available",
  RENTED: "rented",
  PENDING: "pending",
};
export const PROPERTY_AMENITIES = [
  "wifi",
  "air conditioning",
  "kitchen",
  "elevator",
  "parking",
  "balcony",
  "gym",
  "swimming pool",
  "security guard",
  "CCTV",
  "intercom",
  "concierge",
  "laundry room",
  "storage room",
  "generator",
  "satellite TV",
  "garden",
  "rooftop",
  "dishwasher",
  "washing machine",
];
export const PROPERTY_PAYMENT_PERIODS = [
  "monthly",
  "quarterly",
  "semi-annual",
  "yearly",
];
export const PROPERTY_TENANT_TYPES = [
  "any",
  "students",
  "professionals",
  "families",
  "female only",
  "male only",
];
export const PROPERTY_VIEW_TYPES = [
  "garden",
  "city",
  "pool",
  "street",
  "sea",
  "courtyard",
  "open land",
];
export const PROPERTY_HEATING_TYPES = [
  "central AC",
  "split units",
  "fans only",
  "no AC",
  "central heating",
];
export const PROPERTY_BUILDING_AGES = [
  "new (0–2 years)",
  "3–5 years",
  "6–10 years",
  "10+ years",
];
export const PROPERTY_FINISHING_TYPES = [
  "fully finished",
  "semi finished",
  "shell & core",
  "super lux",
  "ultra lux",
];

const DEFAULT_DELAY = 260;

const wait = (ms = DEFAULT_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const buildOwner = ({ id, name, email, avatar }) => ({
  id,
  name,
  email,
  avatar,
  status: "online",
  lastSeen: "Usually replies within 20 min",
  matchPercentage: 96,
  responseTime: "Fast response",
});

const defaultOwnerAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=ffffff`;

const seedProperties = [
  {
    id: "property-101",
    ownerId: "owner-nadine",
    owner: buildOwner({
      id: "owner-nadine",
      name: "Nadine Samir",
      email: "nadine@sakny.dev",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    }),
    title: "Design-forward studio with quiet work zone",
    description:
      "A polished furnished studio with soft daylight, ergonomic desk setup, compact kitchen, and fast internet. Ideal for students or early-career professionals who want a clean, modern base close to Cairo’s east side hubs.",
    type: "studio",
    price: 9800,
    city: "New Cairo",
    district: "Fifth Settlement",
    address: "Fifth Settlement, near North 90 Street",
    rooms: 1,
    bathrooms: 1,
    floor: 4,
    areaSqm: 72,
    furnished: true,
    deposit: 9800,
    availableFrom: "2026-05-01",
    minimumStayMonths: 12,
    paymentPeriod: "monthly",
    maxOccupancy: 2,
    parkingSpots: 1,
    utilitiesIncluded: false,
    internetIncluded: true,
    petsAllowed: false,
    smokingAllowed: false,
    preferredTenant: "professionals",
    amenities: ["wifi", "air conditioning", "kitchen", "balcony"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    ],
    location: { lat: 30.0284, lng: 31.4913 },
    status: PROPERTY_STATUSES.AVAILABLE,
    views: 341,
    messages: 14,
    createdAt: "2026-04-18T10:30:00.000Z",
  },
  {
    id: "property-102",
    ownerId: "owner-youssef",
    owner: buildOwner({
      id: "owner-youssef",
      name: "Youssef Adel",
      email: "youssef@sakny.dev",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    }),
    title: "Private room in premium Maadi apartment",
    description:
      "Private bedroom in a calm shared apartment with elevator access, generous kitchen storage, and balcony seating. Positioned for quick access to cafes, co-working spaces, and metro connections.",
    type: "room",
    price: 6200,
    city: "Maadi",
    district: "Degla",
    address: "Street 233, Degla",
    rooms: 3,
    bathrooms: 2,
    floor: 6,
    areaSqm: 165,
    furnished: true,
    deposit: 6200,
    availableFrom: "2026-05-10",
    minimumStayMonths: 6,
    paymentPeriod: "monthly",
    maxOccupancy: 3,
    parkingSpots: 0,
    utilitiesIncluded: true,
    internetIncluded: true,
    petsAllowed: false,
    smokingAllowed: false,
    preferredTenant: "female only",
    amenities: ["wifi", "air conditioning", "kitchen", "elevator", "balcony"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    ],
    location: { lat: 29.9602, lng: 31.2569 },
    status: PROPERTY_STATUSES.PENDING,
    views: 228,
    messages: 9,
    createdAt: "2026-04-16T15:15:00.000Z",
  },
  {
    id: "property-103",
    ownerId: "owner-lina",
    owner: buildOwner({
      id: "owner-lina",
      name: "Lina Farouk",
      email: "lina@sakny.dev",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    }),
    title: "Bright apartment close to Alexandria waterfront",
    description:
      "Two-bedroom apartment with ocean breeze, flexible furnishing package, and modernized bathroom finishes. Suitable for friends renting together or a small family.",
    type: "apartment",
    price: 11500,
    city: "Alexandria",
    district: "Stanley",
    address: "Stanley, 2 minutes from Corniche",
    rooms: 2,
    bathrooms: 2,
    floor: 8,
    areaSqm: 138,
    furnished: false,
    deposit: 11500,
    availableFrom: "2026-05-04",
    minimumStayMonths: 12,
    paymentPeriod: "monthly",
    maxOccupancy: 4,
    parkingSpots: 1,
    utilitiesIncluded: false,
    internetIncluded: false,
    petsAllowed: true,
    smokingAllowed: false,
    preferredTenant: "families",
    amenities: ["wifi", "kitchen", "elevator", "parking"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1400&q=80",
    ],
    location: { lat: 31.2357, lng: 29.9577 },
    status: PROPERTY_STATUSES.AVAILABLE,
    views: 492,
    messages: 21,
    createdAt: "2026-04-12T11:50:00.000Z",
  },
  {
    id: "property-104",
    ownerId: "owner-omar",
    owner: buildOwner({
      id: "owner-omar",
      name: "Omar Hany",
      email: "omar@sakny.dev",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    }),
    title: "Entire house for long-term Sharqia stays",
    description:
      "A spacious furnished house with parking, family-friendly living spaces, and a quiet neighborhood profile. Strong fit for professionals relocating outside Cairo.",
    type: "house",
    price: 14900,
    city: "Sharkia",
    district: "New Zagazig",
    address: "New Zagazig district",
    rooms: 4,
    bathrooms: 3,
    floor: 2,
    areaSqm: 240,
    furnished: true,
    deposit: 14900,
    availableFrom: "2026-05-20",
    minimumStayMonths: 12,
    paymentPeriod: "monthly",
    maxOccupancy: 6,
    parkingSpots: 2,
    utilitiesIncluded: false,
    internetIncluded: true,
    petsAllowed: true,
    smokingAllowed: true,
    preferredTenant: "families",
    amenities: ["wifi", "air conditioning", "kitchen", "parking", "balcony"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    ],
    location: { lat: 30.5877, lng: 31.502 },
    status: PROPERTY_STATUSES.RENTED,
    views: 187,
    messages: 5,
    createdAt: "2026-04-10T09:20:00.000Z",
  },
];

const readProperties = () => {
  if (typeof window === "undefined") {
    return [...seedProperties];
  }

  const stored = window.localStorage.getItem(PROPERTY_STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(
      PROPERTY_STORAGE_KEY,
      JSON.stringify(seedProperties),
    );
    return [...seedProperties];
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    window.localStorage.setItem(
      PROPERTY_STORAGE_KEY,
      JSON.stringify(seedProperties),
    );
    return [...seedProperties];
  }
};

const writeProperties = (properties) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      PROPERTY_STORAGE_KEY,
      JSON.stringify(properties),
    );
  }

  return properties;
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const applyFilters = (properties, filters = {}) =>
  properties.filter((property) => {
    if (
      filters.city &&
      !normalizeText(property.city).includes(normalizeText(filters.city))
    ) {
      return false;
    }

    if (
      filters.type &&
      filters.type !== "all" &&
      property.type !== filters.type
    ) {
      return false;
    }

    if (
      typeof filters.rooms === "number" &&
      filters.rooms > 0 &&
      property.rooms < filters.rooms
    ) {
      return false;
    }

    if (filters.furnished === true && !property.furnished) {
      return false;
    }

    if (
      typeof filters.priceMin === "number" &&
      property.price < filters.priceMin
    ) {
      return false;
    }

    if (
      typeof filters.priceMax === "number" &&
      filters.priceMax > 0 &&
      property.price > filters.priceMax
    ) {
      return false;
    }

    if (Array.isArray(filters.amenities) && filters.amenities.length > 0) {
      return filters.amenities.every((amenity) =>
        property.amenities.includes(amenity),
      );
    }

    return true;
  });

const sortByNewest = (items) =>
  [...items].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
  );

export const resolveOwnerProfile = (user) => {
  const name = user?.name || "Sakny Landlord";
  const id = String(
    user?.id || user?.email || normalizeText(name) || "landlord-local",
  );

  return buildOwner({
    id,
    name,
    email: user?.email || "landlord@sakny.dev",
    avatar: user?.avatar || defaultOwnerAvatar(name),
  });
};

const propertyService = {
  async getAll(filters = {}) {
    await wait();
    return sortByNewest(applyFilters(readProperties(), filters));
  },

  async getById(id) {
    await wait(120);
    return readProperties().find((property) => property.id === id) || null;
  },

  async getByOwner(ownerId) {
    await wait(180);
    return sortByNewest(
      readProperties().filter((property) => property.ownerId === ownerId),
    );
  },

  async create(input, owner) {
    await wait(220);
    const properties = readProperties();
    const nextProperty = {
      ...input,
      id: `property-${Date.now()}`,
      ownerId: owner.id,
      owner,
      status: input.status || PROPERTY_STATUSES.AVAILABLE,
      views: 0,
      messages: 0,
      createdAt: new Date().toISOString(),
    };

    writeProperties([nextProperty, ...properties]);
    return nextProperty;
  },

  async update(id, updates) {
    await wait(220);
    const properties = readProperties();
    let updatedProperty = null;

    const nextProperties = properties.map((property) => {
      if (property.id !== id) {
        return property;
      }

      updatedProperty = {
        ...property,
        ...updates,
        owner: updates.owner || property.owner,
      };
      return updatedProperty;
    });

    writeProperties(nextProperties);
    return updatedProperty;
  },

  async remove(id) {
    await wait(180);
    const properties = readProperties().filter(
      (property) => property.id !== id,
    );
    writeProperties(properties);
    return true;
  },

  async updateStatus(id, status) {
    return this.update(id, { status });
  },

  async incrementViews(id) {
    const property = await this.getById(id);
    if (!property) {
      return null;
    }

    return this.update(id, { views: (property.views || 0) + 1 });
  },

  async getDashboardStats(ownerId) {
    await wait(160);
    const properties = readProperties().filter(
      (property) => property.ownerId === ownerId,
    );

    return {
      totalListings: properties.length,
      availableListings: properties.filter(
        (property) => property.status === PROPERTY_STATUSES.AVAILABLE,
      ).length,
      rentedListings: properties.filter(
        (property) => property.status === PROPERTY_STATUSES.RENTED,
      ).length,
      totalViews: properties.reduce(
        (sum, property) => sum + (property.views || 0),
        0,
      ),
      newMessages: properties.reduce(
        (sum, property) => sum + (property.messages || 0),
        0,
      ),
    };
  },

  getFilterOptions() {
    const properties = readProperties();
    return {
      types: PROPERTY_TYPES,
      amenities: PROPERTY_AMENITIES,
      cities: Array.from(
        new Set(properties.map((property) => property.city)),
      ).sort(),
      statuses: Object.values(PROPERTY_STATUSES),
    };
  },
};

export default propertyService;
