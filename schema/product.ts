import { z } from "zod"
//schema validation using zod for product form 
const productPriceSchema = z
  .union([
    z.string().trim().min(1, "Price is required"),
    z.number({ error: "Price is required" }),
  ])
  .transform((value) => (typeof value === "string" ? Number(value) : value))
  .refine(
    (value) => Number.isFinite(value) && value > 0,
    "Price must be greater than 0"
  )

export const productSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  price: productPriceSchema,
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required"),
  imageUrl: z.string().trim().url("Enter a valid image URL"),
})
