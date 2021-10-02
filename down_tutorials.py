# -*- coding: utf-8 -*-
import os
import time
import re
import requests
from tqdm import tqdm
from lxml.html import fromstring, tostring, iterlinks
from lxml import etree

# User Config
# root_path = "G:/tenholes/布鲁斯口琴系统课程（上）/"           # for example
# course_url = "http://www.tenholes.com/lessons/list?cid=3"   # for example
root_path = "G:/tenholes/布鲁斯口琴系统课程（下）/"
course_url = "http://www.tenholes.com/lessons/list?cid=15"
ten_auth1 = r"xxx-xxx-xxx"

# Const Variables
base_url = "http://www.tenholes.com"

regex_mp3_jpg = re.compile("[0-9]+\.((jpg)|(mp3)|(gif))")
regex_mp4 = re.compile("http://.+\.mp4\?[0-9a-z|\-|=|_]+")
# /js/no.js?v=1599013993 -> js/no.js
regex_js_css = re.compile("(?<=/).+?(?=\?v=)")

headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
}

# Global Variable
s = requests.session()
s.cookies["ten_auth1"] = ten_auth1


def get_all_lessons():
    r = s.get(course_url, headers=headers, timeout=10)
    html = etree.HTML(r.text)
    div = html.xpath("//div[@class='ls-item clearfix']")
    result = []
    index = 1
    for d in div:
        src = d.xpath("./a/@href")[0]
        types = d.xpath("./a/span/@class")[0]  # free vip1 vip2
        result.append((index, src, types))
        index += 1
    return result


def download_file(url, path, stream=False):
    r = s.get(url, headers=headers, stream=stream, timeout=15)
    if stream:
        chunk_size = 1024*4
        with open(path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=chunk_size):
                if chunk:
                    f.write(chunk)
    else:
        with open(path, 'wb') as f:
            f.write(r.content)


def _download_tutorial(html, types, lesson_name, file_path, time_gap=2):
    for element, attribute, link, pos in iterlinks(html):
        if attribute == 'src':
            if link.startswith("http"):
                # pic or mp3
                name = regex_mp3_jpg.search(link)
                if name:
                    name = name.group(0)
                    download_file(link, f"{file_path}/{name}")
                    element.set(attribute, f"./{lesson_name}/{name}")
                    print(f"Downloading file : {name}")
                    time.sleep(time_gap)

            elif link.startswith("/"):
                # js
                name = regex_js_css.search(link)
                if name:
                    name = name.group(0).split('/')[-1]
                    # download_file(base_url + link, f"{file_path}/{name}")
                    # element.set(attribute, f"./{lesson_name}/{name}")
                    element.set(attribute, f"../assets/{name}")
                    time.sleep(time_gap)

        if attribute == "href":
            # css
            name = regex_js_css.search(link)
            if name:
                name = name.group(0).split('/')[-1]
                # download_file(base_url + link, f"{file_path}/{name}")
                # element.set(attribute, f"./{lesson_name}/{name}")
                element.set(attribute, f"../assets/{name}")
                time.sleep(time_gap)

    html = tostring(html, encoding='utf-8', method="html").decode()

    # download vip mp4
    if types != "free":
        try:
            link = regex_mp4.search(html)
            if link:
                link = link.group(0)
                name = link.split('/')[-1].split('?')[0]
                html = html.replace(link, f"./{lesson_name}/{name}")
                print(f"Downloading file : {name}")
                download_file(link, f"{file_path}/{name}", stream=True)
        except:
            pass
    else:  # bilibili online player
        html = html.replace("//player.bilibili", "http://player.bilibili")

    html_path = root_path + f"/{lesson_name}.html"
    with open(html_path, 'wb') as f:
        f.write(html.encode())


def download_tutorials(urls):
    for (index, url, types) in tqdm(urls):
        r = s.get(base_url + url, headers=headers, timeout=10)
        html = fromstring(r.text)
        # get lesson info
        div = html.xpath("//div[@class='lt-byte clear']")[0]
        name = div.xpath("./p/text()")[0]  # lesson title
        name = name.replace('/', '-').strip()  # avoid mkdir error
        name = f"{index}.{name}"
        # download sheet
        file_path = root_path + "/" + name
        if not os.path.exists(file_path):
            os.mkdir(file_path)
            print(f"\nStart downloading ---> {name}")
            _download_tutorial(html, types, name, file_path)


if __name__ == "__main__":
    if not os.path.exists(root_path):
        os.makedirs(root_path)
    print("Retrieving Lessons Info ...")
    lessons_links = get_all_lessons()
    download_tutorials(lessons_links)
