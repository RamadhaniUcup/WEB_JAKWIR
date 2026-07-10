import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
export declare function updateKrediturProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getMyKrediturProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getAspeks(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createAspek(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateAspek(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteAspek(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getKriterias(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getSubKriterias(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteSubKriteria(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=krediturSettingController.d.ts.map