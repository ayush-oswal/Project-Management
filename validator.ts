import { z } from "zod";


export const projectSchema = z.object({
    title : z.string().min(3, "Title Must be atleast 3 Characters"),
    description : z.string().max(300, "Description must not exceed 300 chars")
})