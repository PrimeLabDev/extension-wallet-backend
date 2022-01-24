import api from "../clients/nearapp.client";
import { NearAppsOfferDTO } from "../interfaces/nearApps.interface";

export class NFTService {
  getDetails = async (nft_id): Promise<NearAppsOfferDTO> => {
    return await api.getNFTDetails(nft_id).catch((err) => {
      console.info({ err });
      throw "Could not get nft details";
    });
  };
}

export default NFTService;
