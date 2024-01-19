import Capacitor
import CropViewController

@objc(PhotoCroppingPlugin)
public class PhotoCroppingPlugin: CAPPlugin, CropViewControllerDelegate {
    private var call: CAPPluginCall?
    private var image: String?
    @objc func cropPhoto(_ call: CAPPluginCall) {
        self.call = call
       
        if let unwrappedImage = call.getString("image") {
            self.image = unwrappedImage
            presentCropViewController(image: unwrappedImage)
        }
        
    }
    
    func presentCropViewController(image: String) {
        let uiImage: UIImage = convertBase64StringToImage(imageBase64String:image);
        
        if let unwrapped = self.bridge?.viewController {
            DispatchQueue.main.async {
            let cropViewController = CropViewController(image: uiImage)
            cropViewController.delegate = self
                unwrapped.present(cropViewController, animated: true, completion: nil)
            }}
    }

    public func cropViewController(_ cropViewController: CropViewController, didCropToImage image: UIImage, withRect cropRect: CGRect, angle: Int) {
        if let unwrapped = self.call {
            self.call = nil;
            self.image = nil;
            unwrapped.resolve(["image":convertImageToBase64String(img: image)])
            cropViewController.dismiss(animated: true, completion: nil)
        }
        
    }
    
    public func cropViewController(_ cropViewController: CropViewController, didFinishCancelled finish: Bool) {
        if let unwrapped = self.call {
            if let unwrappedImage = self.image {
                self.call = nil;
                self.image = nil;
                unwrapped.resolve(["image":unwrappedImage])
                cropViewController.dismiss(animated: true, completion: nil)
            }
            
        }
        
    }
    
    
    func convertImageToBase64String (img: UIImage) -> String {
        return img.jpegData(compressionQuality: 1)?.base64EncodedString() ?? ""
    }
    
    func convertBase64StringToImage (imageBase64String:String) -> UIImage {
        let imageData = Data(base64Encoded: imageBase64String)
        let image = UIImage(data: imageData!)
        return image!
    }
}
