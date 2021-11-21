//
//  ViewController.swift
//  BanubaMemoryLeakProofProject
//
//  Created by Michael Belenchenko on 19.11.2021.
//

import UIKit
import BanubaEffectPlayer

internal let banubaClientToken = "TOKEN HERE"

class ViewController: UIViewController {

    func initBNBUtilityManager() {
        let bundleRoot = Bundle.init(for: BNBEffectPlayer.self).bundlePath
        let dirs = [bundleRoot + "/bnb-resources", Bundle.main.bundlePath + "/effects"]
        BNBUtilityManager.initialize(
            dirs,
            clientToken: banubaClientToken
        )
    } 

    var effectsPlayer: BNBOffscreenEffectPlayer! = nil

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        initBNBUtilityManager()

        self.effectsPlayer = BNBOffscreenEffectPlayer(effectWidth: UInt(500.0), andHeight: UInt(500.0), manualAudio: false)

        self.switchEffect(number: 0)
    }

    func switchEffect(number: Int) {
        let effects = ["Beauty_2", "GlassFire", "Halo", "MusicMoodHeadphone", "NeonBeauty_low", "Rap", "SpaceClub", "Sunglasses_5", "SunglassesMusic"]
        let effect = effects[number]
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1) { [weak self] in
            guard let self = self else { return }

            DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1) { [weak self] in
                guard let self = self else { return }
                NSLog("Banuba Testing loading effect \(effect)")
                self.effectsPlayer.loadEffect(effects[number], completion: {
                    NSLog("Banuba Testing effect loaded \(effect)")
                })

                DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1) { [weak self] in
                    guard let self = self else { return }
                    NSLog("Banuba Testing unloading effect \(effect)")

                    self.effectsPlayer.unloadEffect()
                    self.switchEffect(number: (number + 1) % effects.count)
                }
            }
        }
    }
}

