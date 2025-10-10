import { getCollection } from "astro:content";

export const getWorks = async () => {
  const imageInfo = await getCollection('imageInfo')
  const worksData = await getCollection('works')
  const works = imageInfo.reduce<any[]>((ans, item) => {
    const work = worksData.find(it => it.data.base === item.id);
    if (!work) {
    throw new Error(`La página ${item.id} no existe, por favor verifica!`);
    }
    return [
    ...ans,
    {
    ...work,
    data: {
    ...work.data,
    members: item.data,
    },
    }
    ];
  }, []);
  return works;
}

export default getWorks;
