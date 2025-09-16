import axios from "axios";
import { ILinkResponse, IPaginationQuery, ILinkForm, ILink } from "../zod/link.schema";

export async function getLinks(params: IPaginationQuery): Promise<ILinkResponse> {
    const response = await axios.get<ILinkResponse>("/api/link", { params });
    return response.data;
}

export async function createLink(linkData: ILinkForm): Promise<ILink> {
    const response = await axios.post<ILink>("/api/link", linkData, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
}