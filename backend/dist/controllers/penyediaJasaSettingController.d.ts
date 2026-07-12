import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
export declare function updatePenyediaJasaProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getMyPenyediaJasaProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getKriterias(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getSubKriterias(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=penyediaJasaSettingController.d.ts.map