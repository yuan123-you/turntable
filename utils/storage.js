const STORAGE_KEY = 'turntable_data'

export function getStorage(key) {
  try {
    const data = uni.getStorageSync(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('获取存储数据失败:', e)
    return null
  }
}

export function setStorage(key, data) {
  try {
    uni.setStorageSync(key, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('存储数据失败:', e)
    return false
  }
}

export function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('删除存储数据失败:', e)
    return false
  }
}

export function getUserWheels() {
  return getStorage(STORAGE_KEY) || []
}

export function saveUserWheels(wheels) {
  return setStorage(STORAGE_KEY, wheels)
}

export function addUserWheel(wheel) {
  const wheels = getUserWheels()
  wheels.push(wheel)
  return saveUserWheels(wheels)
}

export function updateUserWheel(wheelId, updatedWheel) {
  const wheels = getUserWheels()
  const index = wheels.findIndex(w => w.id === wheelId)
  if (index !== -1) {
    wheels[index] = updatedWheel
    return saveUserWheels(wheels)
  }
  return false
}

export function deleteUserWheel(wheelId) {
  const wheels = getUserWheels()
  const filteredWheels = wheels.filter(w => w.id !== wheelId)
  return saveUserWheels(filteredWheels)
}

export function getSpinRecords() {
  return getStorage('spin_records') || []
}

export function saveSpinRecords(records) {
  return setStorage('spin_records', records)
}

export function addSpinRecord(record) {
  const records = getSpinRecords()
  records.unshift({
    ...record,
    id: Date.now(),
    timestamp: Date.now()
  })
  if (records.length > 100) {
    records.pop()
  }
  return saveSpinRecords(records)
}

export function clearSpinRecords() {
  return removeStorage('spin_records')
}

export function getSpinCount(date) {
  const key = `spin_count_${date}`
  return getStorage(key) || 0
}

export function setSpinCount(date, count) {
  const key = `spin_count_${date}`
  return setStorage(key, count)
}

export function incrementSpinCount(date) {
  const count = getSpinCount(date)
  return setSpinCount(date, count + 1)
}

export function getLastSpinTime() {
  return getStorage('last_spin_time')
}

export function setLastSpinTime(time) {
  return setStorage('last_spin_time', time)
}

export function canSpin(cooldownSeconds = 3) {
  const lastSpinTime = getLastSpinTime()
  if (!lastSpinTime) return true
  
  const now = Date.now()
  const elapsed = (now - lastSpinTime) / 1000
  return elapsed >= cooldownSeconds
}

export function getDailySpinLimit() {
  return getStorage('daily_spin_limit') || 10
}

export function setDailySpinLimit(limit) {
  return setStorage('daily_spin_limit', limit)
}

export function checkDailySpinLimit() {
  const today = new Date().toISOString().split('T')[0]
  const todayCount = getSpinCount(today)
  const limit = getDailySpinLimit()
  return {
    canSpin: todayCount < limit,
    remaining: limit - todayCount,
    used: todayCount,
    limit: limit
  }
}

export function getExtraSpinCount() {
  return getStorage('extra_spin_count') || 0
}

export function setExtraSpinCount(count) {
  return setStorage('extra_spin_count', count)
}

export function addExtraSpinCount(count) {
  const current = getExtraSpinCount()
  return setExtraSpinCount(current + count)
}

export function checkTotalSpinLimit() {
  const today = new Date().toISOString().split('T')[0]
  const todayCount = getSpinCount(today)
  const limit = getDailySpinLimit()
  const extraCount = getExtraSpinCount()
  const totalLimit = limit + extraCount
  return {
    canSpin: todayCount < totalLimit,
    remaining: totalLimit - todayCount,
    used: todayCount,
    limit: totalLimit,
    baseLimit: limit,
    extraCount: extraCount
  }
}