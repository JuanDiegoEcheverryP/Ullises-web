import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

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

  async addData(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async addDataToPaca2() {
    try {
      const paca2Ref = doc(this.db, "pacas", "paca2");
      const data = {
        attribute1: "value1",
        attribute2: "value2",
        attribute3: "value3"
      };
      await setDoc(paca2Ref, data);
      console.log("Document written with ID: paca2");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}
