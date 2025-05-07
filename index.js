const url = "https://raulif-bookmarks-app.netlify.app/api/bookmarks";

export const saveToDatabase = async (data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok", response);
  }

  return response.json();
};

const getBookmarksFromBrowser = async () => {
  try {
  const [folders, ...rest] = await chrome.bookmarks.getTree()
  const {children: mobileBookmarks} = folders.children.find(fold => fold.folderType === 'mobile')

    return parseBookmarks(mobileBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
  }
};

const parseBookmarks = (bookmarks) => {
  return bookmarks.map((bookmark) => {
    const { id, title, url, dateAdded } = bookmark;
    return {
      bookmarkId: `${id}-${dateAdded}`,
      title,
      url,
      dateAdded
    };
  });
};

export const getAndStoreBookmarks = async () => {
  console.log("Fetching bookmarks from browser...");
  try {
    const boorkmarks =  await getBookmarksFromBrowser();
    const response = await saveToDatabase(boorkmarks);
    console.log("Bookmarks saved to database:", response);
    if (response.status === 200) {
      const button = document.querySelector("button");
      button.innerText = "Success!";
    }
  } catch (error) {
    console.error("Error saving bookmarks to database:", error);
  }
};


const addEventListener = () => {
  const button = document.querySelector("button");
  button.onclick = getAndStoreBookmarks;
};

const init = () => {
  addEventListener();
};
init();
