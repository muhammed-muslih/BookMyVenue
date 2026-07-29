import { AuthenticatedUser } from "@/models/user.model";
import { VenueDocument } from "./venue.types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      venue?: VenueDocument;
    }
  }
}
