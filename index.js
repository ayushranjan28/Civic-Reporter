const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { VertexAI } = require('@google-cloud/vertexai');

// --- INITIALIZATION ---

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Initialize Vertex AI (Gemini)
const vertex_ai = new VertexAI({ project: serviceAccount.project_id, location: 'us-central1' });
const model = 'gemini-1.5-flash-001'; // Or another suitable model

const generativeModel = vertex_ai.getGenerativeModel({
    model: model,
    generationConfig: {
        'maxOutputTokens': 2048,
        'temperature': 0.2,
        'topP': 1,
    },
});

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large JSON payloads for images


// --- API ENDPOINTS ---

// Endpoint 1: Get all reports
app.get('/reports', async (req, res) => {
    try {
        const reportsSnapshot = await db.collection('reports').orderBy('timestamp', 'desc').get();
        const reports = [];
        reportsSnapshot.forEach(doc => {
            reports.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).send("Error fetching reports.");
    }
});

// Endpoint 2: Submit a new report (with Gemini integration)
app.post('/reports', async (req, res) => {
    try {
        const { issueType, photoBase64, location } = req.body;
        let description = req.body.description;

        // **Gemini Feature 1: Analyze Photo to Generate Description**
        if (photoBase64 && !description) {
            const imagePart = {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: photoBase64,
                },
            };
            const prompt = `Analyze this image of a civic issue. Describe the issue concisely in one sentence for a work report. For example: "A large pothole is present on the road," or "A public trash can is overflowing."`;
            const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts: [imagePart, {text: prompt}] }] });
            description = result.response.candidates[0].content.parts[0].text.trim();
        }

        const newReport = {
            issueType,
            description,
            location,
            photo: photoBase64 ? 'true' : 'false', // We won't store the huge base64 string in Firestore
            status: 'Submitted',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('reports').add(newReport);
        res.status(201).json({ id: docRef.id, description: description }); // Return the generated description

    } catch (error) {
        console.error("Error submitting report:", error);
        res.status(500).send("Error submitting report.");
    }
});

// Endpoint 3: Update a report status
app.patch('/reports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.collection('reports').doc(id).update({ status });
        res.status(200).send(`Report ${id} status updated to ${status}`);
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).send("Error updating status.");
    }
});


// --- START SERVER ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});