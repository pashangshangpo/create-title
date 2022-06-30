import { useState, useMemo } from 'react'
import { Button, Input, message } from 'antd'
import { path, fs } from '@tauri-apps/api'
import Pay, { checkActive } from './Pay'

import './App.less'

function App() {
  const [showCreateMaster, setShowCreateMaster] = useState(false)
  const [masterList, setMasterList] = useState([])
  const [currentMasterValue, setCurrentMasterValue] = useState('')

  const isMasterEmpty = useMemo(() => {
    return masterList.length === 0
  }, [masterList.length])

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
          name: currentMasterValue
        }
      ])
    }
  }

  return (
    <>
      <div className='app'>
        <div className='body'>
          <div className='master-list'>
            {
              masterList.map(item => {
                return (
                  <div key={item.name}>
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
              style={isMasterEmpty ? {} : { bottom: '30px', marginBottom: 0, height: '40px' } }
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
      </div>
    </>
  )
}

export default App
