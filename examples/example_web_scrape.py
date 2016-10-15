from time import sleep
from bs4 import BeautifulSoup
from selenium import webdriver
import json

_PATH_TO_PHANTOM = r"C:\Program Files (x86)\JetBrains\PyCharm Community Edition 2016.2\plugins\phantomjs\bin\phantomjs.exe"

driver = webdriver.PhantomJS(executable_path=_PATH_TO_PHANTOM)
driver.get('http://www.latlong.net/category/airports-236-19.html')
sleep(1)
soup = BeautifulSoup(driver.page_source, "html.parser")
print(soup.find('table').find_all("td"))
the_dict = soup.find("table").find_all("td")

items = [json.dumps({'name': x.find('a').text, 'lat': y.text, 'lng': z.text}) for x, y, z in zip(*[iter(the_dict)]*3)]
json_string = "{\"airports\": ["
with open(r'C:\Users\Chris\Desktop\2016blackironhack-chriscoraggio\resources\airports.json', 'w') as fh_out:
    json_string += ",".join(items)
    json_string += "]}"
    json.dump(json_string, fh_out)

print(json_string)