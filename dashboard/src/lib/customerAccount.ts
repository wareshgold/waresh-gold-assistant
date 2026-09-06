export type CustomerAddress = {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
};

export type CustomerProfile = {
  phone: string;
  firstName: string;
  lastName: string;
  addresses: CustomerAddress[];
};

const STORAGE_KEY = "waresh-customer-account";
const ACCOUNT_CHANGE_EVENT = "waresh:account-change";

const emptyProfile = (phone = ""): CustomerProfile => ({
  phone,
  firstName: "",
  lastName: "",
  addresses: [],
});

export function normalizeIranPhone(value: string): string {
  const digits = value.replace(/[^0-9+]/g, "").replace(/^0098/, "+98");
  if (digits.startsWith("+98")) return digits;
  if (digits.startsWith("98")) return `+${digits}`;
  if (digits.startsWith("09")) return `+98${digits.slice(1)}`;
  if (digits.startsWith("9")) return `+98${digits}`;
  return digits;
}

export function isValidIranPhone(phone: string): boolean {
  return /^\+989\d{9}$/.test(normalizeIranPhone(phone));
}

export function readCustomerProfile(): CustomerProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CustomerProfile>;
    if (typeof parsed.phone !== "string") return null;
    return {
      ...emptyProfile(parsed.phone),
      ...parsed,
      addresses: Array.isArray(parsed.addresses) ? parsed.addresses : [],
    };
  } catch {
    return null;
  }
}

export function saveCustomerProfile(profile: CustomerProfile): CustomerProfile {
  if (typeof window === "undefined") return profile;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(ACCOUNT_CHANGE_EVENT));
  return profile;
}

export function clearCustomerProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(ACCOUNT_CHANGE_EVENT));
}

export function updateCustomerProfile(input: Partial<Pick<CustomerProfile, "firstName" | "lastName">>): CustomerProfile {
  const current = readCustomerProfile();
  if (!current) throw new Error("Customer account is not initialized");
  return saveCustomerProfile({ ...current, ...input });
}

export function addCustomerAddress(address: Omit<CustomerAddress, "id">): CustomerProfile {
  const current = readCustomerProfile();
  if (!current) throw new Error("Customer account is not initialized");
  const next = { ...address, id: crypto.randomUUID() };
  return saveCustomerProfile({ ...current, addresses: [...current.addresses, next] });
}

export function removeCustomerAddress(addressId: string): CustomerProfile {
  const current = readCustomerProfile();
  if (!current) throw new Error("Customer account is not initialized");
  return saveCustomerProfile({
    ...current,
    addresses: current.addresses.filter((address) => address.id !== addressId),
  });
}

export function getAccountChangeEvent(): string {
  return ACCOUNT_CHANGE_EVENT;
}
