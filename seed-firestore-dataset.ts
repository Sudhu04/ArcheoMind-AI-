import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, writeBatch, doc, setDoc } from 'firebase/firestore';
import { generate5000IndianArtifacts } from './src/lib/indianDataset';
import fs from 'fs';
import path from 'path';

async function seed() {
    try {
        console.log("🚀 Starting Temp-Admin Bulk Firebase Studio Seeding script...");
        const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
        
        if (!fs.existsSync(configPath)) {
            throw new Error("firebase-applet-config.json not found! Cannot seed without configuration.");
        }

        const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log("📍 Target Project ID:", firebaseConfig.projectId);
        console.log("📍 Target Database ID:", firebaseConfig.firestoreDatabaseId || "(default)");

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

        const adminEmail = "temp_indexer_admin@archeomind.ai";
        const adminPass = "TempAdminPass123!";
        let userCredential;

        console.log(`🔐 Attempting Sign In with: ${adminEmail}...`);
        try {
            userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
            console.log("🔑 Signed in successfully! Credentials verified.");
        } catch (signInErr: any) {
            console.log("📍 Account doesn't exist yet, signing up a new admin account...");
            try {
                userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
                console.log("🎉 Account created successfully!");
                
                // Create the user profile in Firestore
                console.log("📝 Registering admin role in the users database...");
                const userRef = doc(db, 'users', userCredential.user.uid);
                await setDoc(userRef, {
                    id: userCredential.user.uid,
                    email: adminEmail,
                    name: "Temp Seeder Admin",
                    role: "admin",
                    joinedAt: Date.now()
                });
                console.log("✅ Admin profile successfully registered in database!");
            } catch (signUpErr) {
                console.error("❌ Failed to register admin account:", signUpErr);
                throw signUpErr;
            }
        }

        // Wait a small moment for Firestore propagation
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log("📦 Generating 5,000 highly realistic Indian Archeological Artifact records...");
        const artifacts = generate5000IndianArtifacts();
        console.log(`✨ Generated ${artifacts.length} records successfully.`);

        console.log("⚡ Initiating chunk-based batch uploads to Firebase Studio under admin authorization...");
        
        const chunkSize = 250; // Smaller safe threshold for stability
        let successCount = 0;

        for (let i = 0; i < artifacts.length; i += chunkSize) {
            const chunk = artifacts.slice(i, i + chunkSize);
            const batch = writeBatch(db);

            for (const record of chunk) {
                const rec = record as any;
                const docRef = doc(db, 'indian_heritage', rec.id);
                const cleanRecord = {
                    id: rec.id,
                    name: rec.name,
                    type: rec.type,
                    rarityLevel: rec.rarityLevel || 3,
                    civilization: rec.civilization,
                    description: rec.description,
                    culturalSignificance: rec.culturalSignificance || "",
                    estimatedEra: rec.estimatedEra,
                    materialAnalysis: rec.materialComposition || rec.materialAnalysis || "Sandstone",
                    historicalUsage: rec.historicalUsage || "",
                    socialStructureInference: rec.socialStructureInference || "",
                    confidenceScore: rec.confidenceScore || 0.9,
                    region: rec.region || { continent: "Asia", country: "India", state: "Unknown" },
                    location: rec.location || { lat: 20, lng: 78, name: "India" },
                    imageUrl: rec.imageUrl || "",
                    tags: rec.tags || ["Heritage"],
                    timestamp: Date.now()
                };
                batch.set(docRef, cleanRecord);
            }

            console.log(`📤 Uploading batch ${Math.floor(i / chunkSize) + 1}...`);
            await batch.commit();
            successCount += chunk.length;
            console.log(`🎉 Batch successfully committed. Progress: ${successCount} / ${artifacts.length} uploaded.`);
            
            // Short throttle delay to avoid hitting rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log(`🏡 Firestore seeding completed successfully! ${successCount} records are now live inside 'indian_heritage' collection!`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding terminated with error:", error);
        process.exit(1);
    }
}

seed();
