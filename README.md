
**Description：**

- save tenholes lessons&music sheets to local storage according to your account level（free / vip1 / vip2）
- it's a quick and ugly implement

**Requirements：**

- requests
- tqdm
- lxml

**Usage：**

1. clone this [repository](https://github.com/shmily326/tenholes-autosaver) to loaclhost
2. copy `assets` in the repository to the root path where you’ll save lessons&music sheets, like this:
   ![](https://raw.githubusercontent.com/shmily326/ImageBed/master/blog/0e2ff8ebd2ea747f11bc5c13984cd393.png)
3. get `ten_auth1` from `Cookie` after you log into tenholes.com
   ![](https://raw.githubusercontent.com/shmily326/ImageBed/master/blog/20211002210529.png)
4. for downloading music sheets:
   - modify the `root_path` and `ten_auth1` in the `User Config` part of `down_sheets.py`
   - run `down_sheets.py`
   <img src="https://raw.githubusercontent.com/shmily326/ImageBed/master/blog/20211002204846.png" style="zoom:80%;" />
5. for downloading lessons / tutorials：
   -  modify the `root_path`, `ten_auth1` and `course_url` in the `User Config` part of `down_tutorials.py`
   - run `down_tutorials.py`
   <img src="https://raw.githubusercontent.com/shmily326/ImageBed/master/blog/20211002205010.png" style="zoom:80%;" />

**Note：**

- this code is a quick implement and lack of adequate robustness, so if downloads collapse due to network timeout or other exceptions, you should **delete the corresponding directory created by the code first, and then re-run the code** (the code will automatically skip existing downloaded directories).
- **A MINIMUM TIME GAP OF 3 SECONDS FOR CRAWLER IS REQUIRED** (in order not to overload the server).