# -*- coding: utf-8 -*-
import os
import time
import re
import requests
from tqdm import tqdm
from lxml.html import fromstring, tostring, iterlinks
from lxml import etree

# User Config
# root_path = "G:/tenholes/"   # for example
root_path = "G:/tenholes/"
ten_auth1 = r"xxx-xxx-xxx"

# Const Variables
base_url = "http://www.tenholes.com"
target_url = "http://www.tenholes.com/tabs/search/"

regex_mp3_jpg = re.compile("[0-9]+.((jpg)|(mp3))")
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


def get_max_page():
    r = s.get(target_url, params={"page": 1000}, headers=headers, timeout=10)
    html = etree.HTML(r.text)
    div = html.xpath("//ul[@class='wrapper com-page']")[0]
    max_page = div.xpath("./li[last()-1]/a/text()")[0]
    return int(max_page)


def get_all_sheet(max_page, time_gap=1):
    result = []
    for i in range(1, max_page + 1):
        r = s.get(target_url, params={"page": i}, headers=headers, timeout=10)
        html = etree.HTML(r.text)
        div = html.xpath("//div[@class='ms-list']")[0]
        srcs = div.xpath("./a/@href")
        result += srcs
        time.sleep(time_gap)
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


def _download_sheet(html, types, sheet_name, file_path, time_gap=2):
    for element, attribute, link, pos in iterlinks(html):
        if attribute == 'src':
            if link.startswith("http"):
                # pic or mp3
                name = regex_mp3_jpg.search(link)
                if name:
                    name = name.group(0)
                    download_file(link, f"{file_path}/{name}")
                    element.set(attribute, f"./{sheet_name}/{name}")
                    print(f"Downloading file : {name}")
                    time.sleep(time_gap)

            elif link.startswith("/"):
                # js
                name = regex_js_css.search(link)
                if name:
                    name = name.group(0).split('/')[-1]
                    # download_file(base_url + link, f"{file_path}/{name}")
                    # element.set(attribute, f"./{sheet_name}/{name}")
                    element.set(attribute, f"../assets/{name}")
                    time.sleep(time_gap)

        if attribute == "href":
            # css
            name = regex_js_css.search(link)
            if name:
                name = name.group(0).split('/')[-1]
                # download_file(base_url + link, f"{file_path}/{name}")
                # element.set(attribute, f"./{sheet_name}/{name}")
                element.set(attribute, f"../assets/{name}")
                time.sleep(time_gap)

    # download vip banzou
    try:
        div = html.xpath("//input[@id='audioBzSrc']")[0]
        link = div.attrib["value"]
        name = regex_mp3_jpg.search(link)
        if name:
            name = name.group(0)
            print(f"Downloading file : {name}")
            download_file(link, f"{file_path}/{name}")
            div.set("value", f"./{sheet_name}/{name}")
    except:
        pass

    html_path = root_path + f"/{types}/{sheet_name}.html"
    result = tostring(html, encoding='utf-8', method="html")
    with open(html_path, 'wb') as f:
        f.write(result)


def download_sheets(urls):
    for url in tqdm(urls):
        r = s.get(base_url + url, headers=headers, timeout=10)
        html = fromstring(r.text)
        # get sheet info
        div = html.xpath("//div[@class='mt-tit']")[0]
        name = div.xpath("./p/text()")[0]  # music sheet title
        name = name.replace('/', '-')  # avoid mkdir error
        types = div.xpath("./span[1]/text()")[0]  # music sheet type
        # download sheet
        file_path = root_path + f"/{types}/{name}/"
        if not os.path.exists(file_path):
            os.mkdir(file_path)
            print(f"\nStart downloading ---> {name}")
            _download_sheet(html, types, name, file_path)


if __name__ == "__main__":
    if not os.path.exists(root_path + "/布鲁斯口琴"):
        os.makedirs(root_path + "/布鲁斯口琴")
        os.makedirs(root_path + "/半音阶口琴")
    print("Retrieving Sheets Info ...")
    max_page = get_max_page()
    sheets_links = get_all_sheet(max_page)
    download_sheets(sheets_links)
