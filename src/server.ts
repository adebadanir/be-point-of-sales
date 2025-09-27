import express, { Request, Response } from "express";
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
})
