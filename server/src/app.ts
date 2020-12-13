import express, { Request } from "express";
import crypto from "crypto";
import bodyParser from "body-parser";
import { URLMetaOutput, URLRequest, URLMeta } from "./models";

const router = express();
const port = 3000;

router.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
router.use(bodyParser.json()); // Send JSON responses

router.get("/api", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

interface ShortyError {
  error: string;
}

router.post(
  "/api/shorty",
  async (
    req: Request<unknown, URLMetaOutput | ShortyError, Partial<URLRequest>>,
    res
  ) => {
    const fullURL = req.body.fullURL;

    if (!fullURL) {
      return res.status(400).send({ error: "FullURL is required!" });
    }

    const urlMeta = new URLMeta({ fullURL, shortURL: crypto.randomBytes(5) });

    try {
      const urlMetaOutput = await urlMeta.save();

      return res.send(urlMetaOutput);
    } catch {
      return res.status(500).send({ error: "Failed to save URL." });
    }
  }
);

router.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
