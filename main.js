const { app, BrowserWindow, Memu, Menu } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  })

  win.maximize()
  win.show()

  const swaggerUiAssetPath = require('swagger-ui-dist').absolutePath()
  win.loadFile(path.join(swaggerUiAssetPath, 'index.html'))
}

app.whenReady().then(() => {
  createWindow()
  Menu.setApplicationMenu(null)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
