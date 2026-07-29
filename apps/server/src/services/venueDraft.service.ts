import { VenueDraft } from "@/models/venueDraft.model";
import { VenueDraftStatus } from "@bookmyvenue/types";
import { VenueDocument, IVenueDraftChanges } from "@/types/venue.types";

export const upsertVenueDraft = async (
  venue: VenueDocument,
  payload: IVenueDraftChanges,
) => {
  const draft = await VenueDraft.findOne({ venue: venue._id });

  if (!draft) {
    return await VenueDraft.create({
      venue: venue._id,
      owner: venue.owner,
      changes: payload,
      status: VenueDraftStatus.PENDING,
    });
  }

  draft.changes = {
    ...draft.changes,
    ...payload,
  };

  if (draft.status === VenueDraftStatus.REJECTED) {
    draft.status = VenueDraftStatus.PENDING;
    draft.rejectionReason = null;
    draft.reviewedBy = null;
    draft.reviewedAt = null;
  }

  await draft.save();

  return draft;
};
