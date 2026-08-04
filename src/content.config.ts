import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const linkReferenceSchema = z
  .object({
    label: z.string().min(1),
    targetType: z.enum([
      "internal-page",
      "internal-subsection",
      "external-url",
    ]),
    page: z.string().min(1).optional(),
    subsection: z.string().min(1).optional(),
    url: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.targetType === "internal-page" && !value.page) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "linkReferences internal-page entries require page",
        path: ["page"],
      });
    }

    if (value.targetType === "internal-subsection") {
      if (!value.page) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "linkReferences internal-subsection entries require page",
          path: ["page"],
        });
      }
      if (!value.subsection) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "linkReferences internal-subsection entries require subsection",
          path: ["subsection"],
        });
      }
    }

    if (value.targetType === "external-url") {
      if (!value.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "linkReferences external-url entries require url",
          path: ["url"],
        });
      } else if (!/^https?:\/\//i.test(value.url)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "linkReferences external-url entries only support http/https URLs",
          path: ["url"],
        });
      }
    }
  });

const typedContentElementSchema = z
  .object({
    type: z.enum([
      "sectionTitle",
      "subsectionTitle",
      "paragraph",
      "unorderedList",
      "orderedList",
      "quote",
    ]),
    text: z.string().min(1).optional(),
    items: z.array(z.string().min(1)).optional(),
    author: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      ["sectionTitle", "subsectionTitle", "paragraph", "quote"].includes(
        value.type,
      )
    ) {
      if (!value.text) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${value.type} blocks require text`,
          path: ["text"],
        });
      }
    }

    if (["unorderedList", "orderedList"].includes(value.type)) {
      if (!value.items || value.items.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${value.type} blocks require at least one item`,
          path: ["items"],
        });
      }
    }
  });

const pages = defineCollection({
  schema: z
    .object({
      title: z.string().min(1),
      template: z.enum(["structured-narrative"]).optional(),
      pageType: z.enum(["structured-narrative"]).optional(),
      // Markdown-capable inline field.
      introText: z.string().optional(),
      heroImage: z.string().optional(),
      // Plain text only; never parsed as Markdown.
      heroImageAlt: z.string().optional(),
      content: z.array(typedContentElementSchema).optional(),
      linkReferences: z.array(linkReferenceSchema).optional(),
    })
    .superRefine((value, ctx) => {
      const hasStructuredNarrativeFields =
        value.introText !== undefined ||
        value.heroImage !== undefined ||
        value.heroImageAlt !== undefined ||
        value.content !== undefined ||
        value.linkReferences !== undefined ||
        value.pageType === "structured-narrative";

      if (
        hasStructuredNarrativeFields &&
        value.template !== "structured-narrative"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "template must be set to structured-narrative for structured narrative entries",
          path: ["template"],
        });
      }

      if (value.template !== "structured-narrative") {
        return;
      }

      if (value.heroImage && !value.heroImageAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "heroImageAlt is required when heroImage is set",
          path: ["heroImageAlt"],
        });
      }

      const content = value.content ?? [];
      if (content.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "content is required for structured-narrative pages",
          path: ["content"],
        });
        return;
      }

      const hasBodyContent = content.some((element) => {
        if (element.type === "paragraph" || element.type === "quote") {
          return (element.text ?? "").trim().length > 0;
        }

        if (
          element.type === "unorderedList" ||
          element.type === "orderedList"
        ) {
          return (element.items ?? []).some((p) => p.trim().length > 0);
        }

        return false;
      });

      if (!hasBodyContent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "At least one content element must provide paragraph, quote, unorderedList, or orderedList content",
          path: ["content"],
        });
      }
    }),
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/pages",
  }),
});

export const collections = { pages };
