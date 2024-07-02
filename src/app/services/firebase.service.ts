import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, deleteDoc, getDocs } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: any;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyB7xTL7q6ruuqHjIfWpXWDvMKr-E731VZQ",
      authDomain: "ulisses-f6971.firebaseapp.com",
      databaseURL: "https://ulisses-f6971-default-rtdb.firebaseio.com",
      projectId: "ulisses-f6971",
      storageBucket: "ulisses-f6971.appspot.com",
      messagingSenderId: "349940873818",
      appId: "1:349940873818:web:822f0b42b07f0420097663",
      measurementId: "G-B5D9F0VP5K"
    };

    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  async addDocument(collection: string, document: string, data: any) {
    try {
      const Ref = doc(this.db, collection, document);
      await setDoc(Ref, data);
      console.log("Document written with ID: " + document);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async getData(collection: string, document: string) {
    try {
      const paca2Ref = doc(this.db, collection,document);
      const docSnap = await getDoc(paca2Ref);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data(); // Devuelve los datos del documento
      } else {
        console.log("No such document!");
        return null; // Devuelve null si el documento no existe
      }
    } catch (e) {
      console.error("Error getting document: ", e);
      return null; // Devuelve null en caso de error
    }
  }

  async deleteDocumentFromCollection(collection:string,document:string) {
    try {
      const Ref = doc(this.db, collection, document);
      await deleteDoc(Ref);
      console.log("Document successfully deleted!");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }

  async getAllDataFromCollection(colection:string) {
    try {
      const querySnapshot = await getDocs(collection(this.db, colection));
      const allData: any[] = [];
      querySnapshot.forEach((doc) => {
        allData.push({ id: doc.id, ...doc.data() });
      });
      return allData;
    } catch (e) {
      console.error("Error getting all documents: ", e);
      return [];
    }
  }

}
