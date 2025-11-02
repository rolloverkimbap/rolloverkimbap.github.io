import * as MdIcons from 'react-icons/md'
import * as GiIcons from 'react-icons/gi'
import * as FaIcons from 'react-icons/fa'
import * as TbIcons from 'react-icons/tb'
import * as LuIcons from 'react-icons/lu'

// 모든 아이콘을 하나의 객체로 통합
const allIcons = {
  ...MdIcons,
  ...GiIcons,
  ...FaIcons,
  ...TbIcons,
  ...LuIcons,
}

// 아이콘 이름으로 아이콘 컴포넌트 가져오기
export const getIcon = (iconName: string) => {
  return allIcons[iconName as keyof typeof allIcons] || null
}

// 태그별 기본 아이콘 매핑 (tags: text[] 구조용)
export const defaultTagIcons: Record<string, string> = {
  'Extra Hot': 'FaHotjar',
  'Hot': 'GiChiliPepper',
  'Eggs': 'FaEgg',
  'Lactose Free': 'TbMilkOff',
  'Vegetarian': 'FaLeaf',
  'Fish': 'FaFish',
  'Seafood': 'FaFish',
  'Meat': 'GiMeat',
  'Soy': 'LuBean',
}

// 태그 문자열에서 아이콘 가져오기 (tags: string[])
export const getTagIcon = (tagName: string) => {
  // defaultTagIcons에서 찾기 (대소문자 구분 없음)
  const defaultIcon = defaultTagIcons[tagName]
  if (defaultIcon) {
    return getIcon(defaultIcon)
  }
  return null
}
