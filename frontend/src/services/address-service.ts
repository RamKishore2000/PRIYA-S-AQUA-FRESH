import { apiRequest } from "@/services/auth-service";


export type Address = {
  id: number;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
};

export type AddressPayload = Omit<Address, "id">;


export async function fetchAddresses() {
  const data = await apiRequest<{ addresses: Address[] }>("/api/addresses");
  return data.addresses;
}

export async function createAddress(payload: AddressPayload) {
  const data = await apiRequest<{ address: Address }>("/api/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.address;
}

