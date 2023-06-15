//
//  iResucitoScreenshotsTests.swift
//  iResucitoScreenshotsTests
//
//  Created by Javier Castro on 15/06/2023.
//

import XCTest

final class iResucitoScreenshotsTests: XCTestCase {
  var app: XCUIApplication!
  let device = XCUIDevice.shared
  
  override func setUpWithError() throws {
    continueAfterFailure = false
    
    app = XCUIApplication()
    setupSnapshot(app)
    app.launch()
    device.orientation = UIDeviceOrientation.portrait
  }
  
  override func tearDownWithError() throws {
    app.terminate()
  }
  
  func testTakeScreenshots() {
    // Esperar carga completa y visualizacion del menu
    if app.buttons["songs-tab"].firstMatch.waitForExistence(timeout: 5) {
      
      snapshot("BuscarCantos")
      
      app.otherElements["search_title.alpha"].tap()
      
      // a la cena del cordero
      app.otherElements["song-158"].tap()
      
      snapshot("Canto-Pantalla")
      
      app.buttons["view-pdf-button"].tap()
      
      snapshot("Canto-PDF")
      
      app.buttons["back-button"].tap()
      app.buttons["back-button"].tap()
      app.buttons["back-button"].tap()
      
      app.buttons["lists-tab"].tap()
      
      snapshot("Listas")
      
      app.buttons["community-tab"].tap()
      
      snapshot("Comunidad")
      
      app.buttons["settings-tab"].tap()
      
      snapshot("Configuracion")
            
    }
  }
}
