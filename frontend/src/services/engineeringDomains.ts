const API_BASE_URL = "http://localhost:5000/api/engineering-domains";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface EngineeringDomain {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  color?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchEngineeringDomains = async (): Promise<EngineeringDomain[]> => {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to load engineering domains.");
  }

  const payload = await response.json();
  return payload.data || [];
};

export const createEngineeringDomain = async (input: Partial<EngineeringDomain>) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to create engineering domain.");
  }

  return payload.data as EngineeringDomain;
};

export const updateEngineeringDomain = async (id: string, input: Partial<EngineeringDomain>) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to update engineering domain.");
  }

  return payload.data as EngineeringDomain;
};

export const deleteEngineeringDomain = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Failed to delete engineering domain.");
  }

  return payload.data;
};
