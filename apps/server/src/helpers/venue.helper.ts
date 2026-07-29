import { VenueDocument } from "@/types/venue.types";
import { UpdateVenueDTO } from "@/validators/venue.validator";

export const applyVenueChanges = (
  venue: VenueDocument,
  payload: UpdateVenueDTO,
) => {
  if (payload.name !== undefined) {
    venue.name = payload.name;
  }
  if (payload.description !== undefined) {
    venue.description = payload.description;
  }

  if (payload.category !== undefined) {
    venue.category = payload.category;
  }

  if (payload.images !== undefined) {
    venue.images = payload.images;
  }

  if (payload.amenities !== undefined) {
    venue.amenities = payload.amenities;
  }

  if (payload.capacity !== undefined) {
    venue.capacity = payload.capacity;
  }

  if (payload.pricing?.basePrice !== undefined) {
    venue.pricing.basePrice = payload.pricing.basePrice;
  }

  if (payload.pricing?.discountPercentage !== undefined) {
    venue.pricing.discountPercentage = payload.pricing.discountPercentage;
  }

  if (payload.contact?.phone !== undefined) {
    venue.contact.phone = payload.contact.phone;
  }

  if (payload.contact?.email !== undefined) {
    venue.contact.email = payload.contact.email;
  }

  if (payload.address !== undefined) {
    venue.address = payload.address;
  }

  if (payload.city !== undefined) {
    venue.city = payload.city;
  }

  if (payload.state !== undefined) {
    venue.state = payload.state;
  }

  if (payload.pincode !== undefined) {
    venue.pincode = payload.pincode;
  }
};
