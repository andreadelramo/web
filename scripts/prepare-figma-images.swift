// Extract the original image fills at native resolution, using the crop rectangles
// from the supplied Figma frames. No screenshot rasterization or upscaling.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
import CoreImage

let input = URL(fileURLWithPath: CommandLine.arguments[1])
let output = URL(fileURLWithPath: CommandLine.arguments[2])
struct Asset {
    let name: String
    let node: String
    let frame: CGSize
    let crop: CGRect?
    var saturation: Double = 1
}
let assets: [Asset] = [
    Asset(name: "github-cover", node: "1:204", frame: CGSize(width: 658, height: 647), crop: CGRect(x: 0.204696253, y: 0.036065590, width: 0.653201938, height: 0.961896718)),
    Asset(name: "exhibify-cover", node: "1:215", frame: CGSize(width: 658, height: 647), crop: nil),
    Asset(name: "dokify-cover", node: "1:225", frame: CGSize(width: 658, height: 647), crop: nil),
    Asset(name: "ctt-cover", node: "1:238", frame: CGSize(width: 658, height: 647), crop: CGRect(x: 0.480789185, y: 0.407665253, width: 0.461579025, height: 0.302727312)),
    Asset(name: "github-calendar", node: "1:248", frame: CGSize(width: 658, height: 492), crop: CGRect(x: 0.155328184, y: 0.113448896, width: 0.672418654, height: 0.754079700)),
    Asset(name: "github-mobile", node: "1:250", frame: CGSize(width: 413, height: 519), crop: CGRect(x: 0.134611130, y: 0.019258311, width: 0.809582472, height: 0.678328633)),
    Asset(name: "exhibify-tablet", node: "1:259", frame: CGSize(width: 658, height: 543), crop: CGRect(x: 0.146543190, y: 0.126408964, width: 0.634547532, height: 0.837834179), saturation: 1.127118647),
    Asset(name: "exhibify-desktop", node: "1:261", frame: CGSize(width: 413, height: 647), crop: CGRect(x: 0.239706472, y: -0.002748017, width: 0.540486336, height: 0.635403037)),
    Asset(name: "dokify-mobile", node: "1:269", frame: CGSize(width: 413, height: 383), crop: CGRect(x: 0, y: 0.147412091, width: 1, height: 0.618315935)),
    Asset(name: "dokify-system", node: "1:271", frame: CGSize(width: 658, height: 647), crop: nil),
    Asset(name: "ctt-shipping", node: "1:277", frame: CGSize(width: 658, height: 647), crop: nil),
    Asset(name: "ctt-mobile", node: "1:279", frame: CGSize(width: 413, height: 445), crop: CGRect(x: 0.318044454, y: 0.226802111, width: 0.363911182, height: 0.522937536))
]

func load(_ name: String) -> CGImage {
    let source = CGImageSourceCreateWithURL(input.appendingPathComponent("\(name).png") as CFURL, nil)!
    return CGImageSourceCreateImageAtIndex(source, 0, nil)!
}
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
let imageContext = CIContext(options: [.workingColorSpace: colorSpace, .useSoftwareRenderer: true])
var manifest: [[String: Any]] = []
for asset in assets {
    var image = load(asset.name)
    let sourceWidth = image.width, sourceHeight = image.height
    if asset.saturation != 1 {
        let adjusted = CIImage(cgImage: image).applyingFilter("CIColorControls", parameters: [kCIInputSaturationKey: asset.saturation])
        image = imageContext.createCGImage(adjusted, from: adjusted.extent)!
    }
    let width = CGFloat(image.width), height = CGFloat(image.height)
    let rect: CGRect
    if let normalized = asset.crop {
        rect = CGRect(x: (normalized.minX * width).rounded(), y: (normalized.minY * height).rounded(), width: (normalized.width * width).rounded(), height: (normalized.height * height).rounded())
    } else {
        let ratio = asset.frame.width / asset.frame.height
        let cropWidth = min(width, height * ratio).rounded()
        let cropHeight = min(height, width / ratio).rounded()
        rect = CGRect(x: ((width - cropWidth) / 2).rounded(), y: ((height - cropHeight) / 2).rounded(), width: cropWidth, height: cropHeight)
    }
    let context = CGContext(data: nil, width: Int(rect.width), height: Int(rect.height), bitsPerComponent: 8, bytesPerRow: 0, space: colorSpace, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    context.setFillColor(CGColor(gray: 1, alpha: 1))
    context.fill(CGRect(origin: .zero, size: rect.size))
    context.interpolationQuality = .high
    let intersection = rect.intersection(CGRect(x: 0, y: 0, width: width, height: height))
    let cropped = image.cropping(to: intersection)!
    context.draw(cropped, in: CGRect(x: intersection.minX - rect.minX, y: rect.height - (intersection.minY - rect.minY) - intersection.height, width: intersection.width, height: intersection.height))
    if asset.name == "github-mobile" {
        // Preserve the separate Webby badge in the same position as the PDF/Figma composition.
        let badge = load("github-badge")
        let badgeRect = CGRect(x: rect.width * 261 / 413, y: rect.height * (1 - (31 + 122) / 519), width: rect.width * 123 / 413, height: rect.height * 122 / 519)
        context.draw(badge, in: badgeRect)
    }
    let result = context.makeImage()!
    let png = asset.name == "dokify-system"
    let filename = "\(asset.name).\(png ? "png" : "jpg")"
    let destination = CGImageDestinationCreateWithURL(output.appendingPathComponent(filename) as CFURL, (png ? UTType.png.identifier : UTType.jpeg.identifier) as CFString, 1, nil)!
    CGImageDestinationAddImage(destination, result, png ? nil : [kCGImageDestinationLossyCompressionQuality: 0.95] as CFDictionary)
    precondition(CGImageDestinationFinalize(destination))
    manifest.append(["file": filename, "figmaNode": asset.node, "sourceWidth": sourceWidth, "sourceHeight": sourceHeight, "width": result.width, "height": result.height])
    print("\(filename): \(sourceWidth)×\(sourceHeight) → \(result.width)×\(result.height)")
}
let data = try JSONSerialization.data(withJSONObject: manifest, options: [.prettyPrinted, .sortedKeys])
try data.write(to: output.appendingPathComponent("figma-image-sources.json"))
