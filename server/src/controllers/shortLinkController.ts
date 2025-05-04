import { Request, Response } from "express";
import * as urlService from "../services/urlService";

export const encodeUrl = async (req: Request, res: Response) => {
  try {
    const { original_url } = req.body;
    if (!original_url)
      return res.status(400).json({ error: "Original URL is required" });

    const result = await urlService.createShortLink(original_url);
    res.status(201).json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};

export const decodeUrl = async (req: Request, res: Response) => {
  try {
    const { short_code } = req.body;
    if (!short_code)
      return res.status(400).json({ error: "Short code is required" });

    const original_url = await urlService.getOriginalUrl(short_code);
    res.json({ original_url });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const { url_path } = req.params;
    const stats = await urlService.getStatsByCode(url_path);
    res.json({
      short_code: url_path,
      original_url: stats.original_url,
      click_count: stats.visit_count || 0,
      created_at: stats.created_at,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};

export const listUrls = async (_req: Request, res: Response) => {
  try {
    const urls = await urlService.listAllUrls();
    res.json(urls);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};

export const redirectToOriginal = async (req: Request, res: Response) => {
  try {
    const { url_path } = req.params;
    const original_url = await urlService.incrementClickAndGetOriginal(
      url_path
    );
    res.redirect(original_url);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};
