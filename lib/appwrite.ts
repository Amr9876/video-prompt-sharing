export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.demo.andoridapp",
  projectId: "66924cb6001c0b889be1",
  databaseId: "66924f38002a6a694535",
  usersCollectionId: "66924f6d00329c128a08",
  videosCollectionId: "66924fb0002f4fe1a5ca",
  sotrageId: "669252110015fcefc4be",
};

import { ICreateVideoForm } from "@/interfaces/ICreateVideoForm";
import {
  Account,
  Avatars,
  Client,
  Storage,
  Databases,
  ID,
  Query,
  ImageGravity,
} from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const db = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(name);

    await signIn(email, password);

    const newUser = await db.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username: name,
        email,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error("Failed to get current account");

    const currentUser = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("Failed to get current user");

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchPosts = async (query: string) => {
  try {
    const posts = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const posts = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFilePreview = (id: string, type: "image" | "video") => {
  let fileUrl: URL | null = null;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.sotrageId, id);
    }

    if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.sotrageId,
        id,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    }

    return fileUrl;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file: any, type: "image" | "video") => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.sotrageId,
      ID.unique(),
      asset
    );
    const fileUrl = getFilePreview(uploadFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw error;
  }
};

export const createVideo = async (form: ICreateVideoForm) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await db.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
