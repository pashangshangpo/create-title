import { useState, useMemo, useEffect } from 'react'
import { Button, Input, message } from 'antd'
import { path, fs } from '@tauri-apps/api'
import { titleJoins } from './common'

import './App.less'

function App() {
  const [showCreateMaster, setShowCreateMaster] = useState(false)
  const [itemMasterIndex, setItemMasterIndex] = useState(-1)
  const [masterList, setMasterList] = useState(() => {
    return JSON.parse(localStorage.getItem('local-data')) || []
  })
  const [currentMasterValue, setCurrentMasterValue] = useState('')

  useEffect(() => {
    localStorage.setItem('local-data', JSON.stringify(masterList))
  }, [masterList])

  const isMasterEmpty = useMemo(() => {
    return masterList.length === 0
  }, [masterList.length])

  const itemMaster = useMemo(() => {
    if (itemMasterIndex === -1) {
      return null
    }

    return masterList[itemMasterIndex]
  }, [itemMasterIndex])

  const handleRemoveMaster = (name) => (e) => {
    const index = masterList.findIndex(item => item.name === name)

    masterList.splice(index, 1)

    setMasterList([...masterList])

    e.stoppropagation()
  }

  const handleCreateMaster = () => {
    setShowCreateMaster(true)
  }

  const handleMasterChange = (e) => {
    setCurrentMasterValue(e.target.value)
  }

  const handleCreateMasterOk = () => {
    setCurrentMasterValue('')
    setShowCreateMaster(false)

    if (currentMasterValue) {
      setMasterList([
        ...masterList,
        {
          name: currentMasterValue,
          list: [[], [], []]
        }
      ])
    }
  }

  const handleShowItemMaster = (name) => () => {
    const index = masterList.findIndex(item => item.name === name)

    setItemMasterIndex(index)
  }

  const handleSectionChange = (listIndex) => (e) => {
    itemMaster.list[listIndex] = e.target.value.trim().split('\n')

    setMasterList([...masterList])
  }

  const handleCreateTitle = async () => {
    const titles = titleJoins(itemMaster.list)

    await exportTitles(titles)

    handleBackList()
  }

  const handleBackList = () => {
    setItemMasterIndex(-1)
  }

  const exportTitles = async (titles) => {
    const desktop = await path.desktopDir()
    const filePath = await path.join(desktop, itemMaster.name + '.json')

    await fs.writeFile({ path: filePath, contents: JSON.stringify({ name: itemMaster.name, list: titles }) })

    message.success('导出成功！')
  }

  const renderMaster = () => {
    if (itemMaster) {
      return null
    }

    return (
      <div className='master'>
        <div className='master-list'>
          {
            masterList.map(item => {
              return (
                <div
                  key={item.name}
                  onClick={handleShowItemMaster(item.name)}
                >
                  <span>{item.name}</span>
                  <span className='remove' onClick={handleRemoveMaster(item.name)}>X</span>
                </div>
              )
            })
          }
        </div>
        <div className='create-master'>
          <div
            className='button'
            style={isMasterEmpty ? {} : { bottom: '30px', marginBottom: 0, height: '40px' }}
            onClick={handleCreateMaster}
          >创建主题</div>
          <div hidden={isMasterEmpty} className='line'></div>
        </div>
        <div hidden={!showCreateMaster} className='create-master-model'>
          <div className='model-body'>
            <Input.TextArea
              value={currentMasterValue}
              placeholder='请输入主题内容'
              rows={8}
              autoSize={{
                maxRows: 8,
                minRows: 8,
              }}
              autoFocus
              onChange={handleMasterChange}
            />
            <Button
              className='button'
              type='primary'
              onClick={handleCreateMasterOk}
            >确定</Button>
          </div>
        </div>
      </div>
    )
  }

  const renderMasterDetail = () => {
    if (!itemMaster) {
      return null
    }

    return (
      <div className='master-detail'>
        <div className='main'>
          {
            itemMaster.list.map((section, index) => {
              return (
                <div key={index} className='section'>
                  <textarea
                    placeholder='请输入关键词'
                    onChange={handleSectionChange(index)}
                    defaultValue={section.join('\n')}
                  ></textarea>
                </div>
              )
            })
          }
        </div>
        <div className='footer'>
          <div className='create-title' onClick={handleCreateTitle}>生成标题</div>
          <div className='back-list' onClick={handleBackList}>返回列表</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='app'>
        {renderMaster()}
        {renderMasterDetail()}
      </div>
    </>
  )
}

export default App
