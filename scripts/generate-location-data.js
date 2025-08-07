import list from 'china-location/dist/location.json' assert { type: 'json' };
import fs from 'fs';

// 生成级联选择格式的数据
function generateCascaderData() {
  const cascaderData = [];
  
  // 遍历所有省份
  Object.keys(list).forEach(provinceCode => {
    const province = list[provinceCode];
    const provinceData = {
      value: province.name,
      label: province.name,
      children: []
    };

    // 遍历该省份下的所有城市
    Object.keys(province.cities).forEach(cityCode => {
      const city = province.cities[cityCode];
      const cityData = {
        value: city.name,
        label: city.name,
        children: []
      };

      // 遍历该城市下的所有区县
      Object.keys(city.districts).forEach(districtCode => {
        const districtName = city.districts[districtCode];
        cityData.children.push({
          value: districtName,
          label: districtName
        });
      });

      provinceData.children.push(cityData);
    });

    cascaderData.push(provinceData);
  });

  return cascaderData;
}

// 生成数据
const cascaderData = generateCascaderData();

// 生成文件内容
const fileContent = `// 完整的省市县级联选择数据（基于china-location库）
export const cascaderOptions = ${JSON.stringify(cascaderData, null, 2)};

// 统计信息:
// 省份数量: ${cascaderData.length}
let totalCities = 0;
let totalCounties = 0;
cascaderData.forEach(province => {
  totalCities += province.children.length;
  province.children.forEach(city => {
    totalCounties += city.children.length;
  });
});
// 城市数量: ${cascaderData.reduce((sum, province) => sum + province.children.length, 0)}
// 区县数量: ${cascaderData.reduce((sum, province) => 
  sum + province.children.reduce((citySum, city) => citySum + city.children.length, 0), 0)}
`;

// 写入文件
fs.writeFileSync('src/data/cascaderOptions.ts', fileContent, 'utf8');

console.log('省市县数据已生成到 src/data/cascaderOptions.ts');
console.log(`统计信息: ${cascaderData.length} 个省份`); 